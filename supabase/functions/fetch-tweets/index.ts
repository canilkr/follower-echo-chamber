
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rate limiting helper - simple in-memory store for this instance
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(key: string, limit: number = 900, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const current = rateLimitStore.get(key) || { count: 0, resetTime: now + windowMs };
  
  // Reset if window has passed
  if (now > current.resetTime) {
    current.count = 0;
    current.resetTime = now + windowMs;
  }
  
  if (current.count >= limit) {
    console.log(`Rate limit reached for ${key}. Reset at: ${new Date(current.resetTime).toISOString()}`);
    return false;
  }
  
  current.count++;
  rateLimitStore.set(key, current);
  return true;
}

// Exponential backoff with jitter
async function delay(attempt: number): Promise<void> {
  const baseDelay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s, 8s...
  const jitter = Math.random() * 1000; // Add up to 1s jitter
  const totalDelay = baseDelay + jitter;
  console.log(`Waiting ${Math.round(totalDelay)}ms before retry attempt ${attempt + 1}`);
  await new Promise(resolve => setTimeout(resolve, totalDelay));
}

async function fetchWithRetry(url: string, options: RequestInit, maxRetries: number = 3): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt + 1} for: ${url}`);
      const response = await fetch(url, options);
      
      // Handle rate limiting
      if (response.status === 429) {
        const rateLimitReset = response.headers.get('x-rate-limit-reset');
        const retryAfter = response.headers.get('retry-after');
        
        console.log(`Rate limit hit (429). Reset: ${rateLimitReset}, Retry-After: ${retryAfter}`);
        
        if (attempt < maxRetries) {
          // Use retry-after header if available, otherwise exponential backoff
          if (retryAfter) {
            const retryDelayMs = parseInt(retryAfter) * 1000;
            console.log(`Waiting ${retryDelayMs}ms as instructed by Twitter API`);
            await new Promise(resolve => setTimeout(resolve, retryDelayMs));
          } else {
            await delay(attempt);
          }
          continue;
        } else {
          throw new Error(`Rate limit exceeded after ${maxRetries + 1} attempts`);
        }
      }
      
      // Handle other errors
      if (!response.ok && response.status !== 429) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      return response;
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt + 1} failed:`, error.message);
      
      if (attempt < maxRetries && (error.message.includes('429') || error.message.includes('rate limit'))) {
        await delay(attempt);
        continue;
      }
      
      // If it's not a rate limit error, don't retry
      if (!error.message.includes('429') && !error.message.includes('rate limit')) {
        throw error;
      }
    }
  }
  
  throw lastError || new Error('Max retries exceeded');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetch tweets function called');
    
    const bearerToken = Deno.env.get('TWITTER_BEARER_TOKEN');
    
    if (!bearerToken) {
      console.error('Missing TWITTER_BEARER_TOKEN');
      return new Response(
        JSON.stringify({ 
          error: 'Twitter API credentials not configured',
          tweets: [] 
        }), 
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { username } = await req.json();
    console.log('Fetching tweets for username:', username);

    // Check rate limit before making requests
    if (!checkRateLimit('twitter-api')) {
      console.log('Rate limit reached, returning empty result');
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit reached, please try again later',
          tweets: [],
          rateLimited: true
        }), 
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const requestHeaders = {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    };

    // First get user ID with retry logic
    console.log('Fetching user ID...');
    const userResponse = await fetchWithRetry(
      `https://api.twitter.com/2/users/by/username/${username}`,
      { headers: requestHeaders }
    );

    const userData = await userResponse.json();
    
    if (!userData.data?.id) {
      console.error('User not found:', username);
      return new Response(
        JSON.stringify({ 
          error: `User ${username} not found`,
          tweets: [] 
        }), 
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const userId = userData.data.id;
    console.log('Found user ID:', userId);

    // Then get user's tweets with retry logic
    console.log('Fetching tweets...');
    const tweetsResponse = await fetchWithRetry(
      `https://api.twitter.com/2/users/${userId}/tweets?max_results=20&tweet.fields=created_at,public_metrics,attachments&expansions=attachments.media_keys,author_id&media.fields=type,url,preview_image_url&user.fields=name,username,profile_image_url`,
      { headers: requestHeaders }
    );

    const tweetsData = await tweetsResponse.json();
    console.log(`Successfully fetched ${tweetsData.data?.length || 0} tweets for ${username}`);

    const tweets = tweetsData.data || [];
    const users = tweetsData.includes?.users || [];
    const media = tweetsData.includes?.media || [];
    
    const author = users.find((user: any) => user.id === userId) || {
      username: username,
      name: username,
      profile_image_url: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`
    };

    const formattedTweets = tweets.map((tweet: any) => {
      const tweetMedia = tweet.attachments?.media_keys?.map((key: string) => {
        const mediaItem = media.find((m: any) => m.media_key === key);
        return mediaItem ? {
          type: mediaItem.type,
          url: mediaItem.url || mediaItem.preview_image_url
        } : null;
      }).filter(Boolean) || [];

      return {
        id: tweet.id,
        text: tweet.text,
        created_at: tweet.created_at,
        media: tweetMedia,
        url: `https://twitter.com/${username}/status/${tweet.id}`,
        author: author
      };
    });

    console.log(`Returning ${formattedTweets.length} formatted tweets`);

    return new Response(
      JSON.stringify({ tweets: formattedTweets }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in fetch-tweets function:', error);
    
    // Return partial success for rate limit errors
    if (error.message.includes('Rate limit') || error.message.includes('429')) {
      return new Response(
        JSON.stringify({ 
          error: 'Twitter API rate limit reached. Please try again in a few minutes.',
          tweets: [],
          rateLimited: true
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        tweets: []
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  }
});
