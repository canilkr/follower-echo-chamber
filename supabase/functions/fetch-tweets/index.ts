
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    console.log('Fetch tweets function called (using search endpoint)');
    
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

    const requestHeaders = {
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    };

    // Use the recent search endpoint instead of user timeline
    const searchQuery = 'from:yashchitneni -is:retweet';
    const searchParams = new URLSearchParams({
      query: searchQuery,
      'tweet.fields': 'created_at,public_metrics',
      'expansions': 'author_id',
      'user.fields': 'profile_image_url,name,username',
      'max_results': '10'
    });

    const searchUrl = `https://api.twitter.com/2/tweets/search/recent?${searchParams.toString()}`;
    
    console.log(`Searching for tweets with query: ${searchQuery}`);
    
    const response = await fetchWithRetry(searchUrl, { headers: requestHeaders });
    const data = await response.json();
    
    console.log('Search API response received:', JSON.stringify(data, null, 2));
    
    if (!data.data || data.data.length === 0) {
      console.log('No tweets found in search results');
      return new Response(
        JSON.stringify({ 
          tweets: [],
          message: 'No recent tweets found for the specified user'
        }), 
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get user information from the includes section
    const users = data.includes?.users || [];
    const targetUser = users.find((user: any) => user.username === 'yashchitneni');
    
    if (!targetUser) {
      console.error('Target user not found in API response');
      return new Response(
        JSON.stringify({ 
          error: 'User data not found in API response',
          tweets: [] 
        }), 
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Enrich tweets with user data
    const enrichedTweets = data.data.map((tweet: any) => ({
      id: tweet.id,
      text: tweet.text,
      created_at: tweet.created_at,
      url: `https://twitter.com/${targetUser.username}/status/${tweet.id}`,
      author: {
        username: targetUser.username,
        name: targetUser.name,
        profile_image_url: targetUser.profile_image_url || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`
      }
    }));

    // Sort by created_at in descending order
    enrichedTweets.sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    console.log(`Successfully fetched ${enrichedTweets.length} tweets using search API`);
    
    return new Response(
      JSON.stringify({ 
        tweets: enrichedTweets,
        summary: {
          totalTweets: enrichedTweets.length,
          searchQuery: searchQuery,
          endpoint: 'search/recent'
        }
      }),
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
