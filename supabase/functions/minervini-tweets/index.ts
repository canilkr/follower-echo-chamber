
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Minervini tweets function called');
    
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

    // First get user ID
    const userResponse = await fetch(
      `https://api.twitter.com/2/users/by/username/${username}`,
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!userResponse.ok) {
      console.error('Failed to fetch user:', userResponse.status, userResponse.statusText);
      const errorText = await userResponse.text();
      console.error('User API error:', errorText);
      throw new Error(`Failed to fetch user: ${userResponse.status}`);
    }

    const userData = await userResponse.json();
    const userId = userData.data.id;
    console.log('Found user ID:', userId);

    // Then get user's tweets
    const tweetsResponse = await fetch(
      `https://api.twitter.com/2/users/${userId}/tweets?max_results=20&tweet.fields=created_at,public_metrics,attachments&expansions=attachments.media_keys,author_id&media.fields=type,url,preview_image_url&user.fields=name,username,profile_image_url`,
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!tweetsResponse.ok) {
      console.error('Failed to fetch tweets:', tweetsResponse.status, tweetsResponse.statusText);
      const errorText = await tweetsResponse.text();
      console.error('Tweets API error:', errorText);
      throw new Error(`Failed to fetch tweets: ${tweetsResponse.status}`);
    }

    const tweetsData = await tweetsResponse.json();
    console.log('Raw tweets data:', JSON.stringify(tweetsData, null, 2));

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

    console.log('Formatted tweets:', formattedTweets.length);

    return new Response(
      JSON.stringify({ tweets: formattedTweets }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in minervini-tweets function:', error);
    
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
