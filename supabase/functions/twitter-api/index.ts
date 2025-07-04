
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TWITTER_BEARER_TOKEN = Deno.env.get('TWITTER_BEARER_TOKEN');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Twitter API function called');
    
    const { username, type } = await req.json();
    console.log(`Request: username=${username}, type=${type}`);
    
    if (!TWITTER_BEARER_TOKEN) {
      console.error('Twitter Bearer Token not configured');
      throw new Error('Twitter Bearer Token not configured');
    }

    if (!username || !type) {
      console.error('Missing username or type parameter');
      throw new Error('Missing username or type parameter');
    }

    let tweets;
    
    if (type === 'user-tweets') {
      console.log(`Fetching user ID for ${username}`);
      
      // Get user ID first
      const userResponse = await fetch(`https://api.twitter.com/2/users/by/username/${username}`, {
        headers: {
          'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!userResponse.ok) {
        const errorText = await userResponse.text();
        console.error(`Failed to fetch user: ${userResponse.status} - ${errorText}`);
        throw new Error(`Failed to fetch user: ${userResponse.statusText}`);
      }

      const userData = await userResponse.json();
      console.log('User data:', userData);
      
      if (!userData.data) {
        throw new Error(`User ${username} not found`);
      }
      
      const userId = userData.data.id;
      console.log(`User ID for ${username}: ${userId}`);

      // Get user tweets
      const tweetsResponse = await fetch(
        `https://api.twitter.com/2/users/${userId}/tweets?max_results=10&tweet.fields=created_at,public_metrics&user.fields=profile_image_url,verified`,
        {
          headers: {
            'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!tweetsResponse.ok) {
        const errorText = await tweetsResponse.text();
        console.error(`Failed to fetch tweets: ${tweetsResponse.status} - ${errorText}`);
        throw new Error(`Failed to fetch tweets: ${tweetsResponse.statusText}`);
      }

      tweets = await tweetsResponse.json();
      console.log('Tweets response:', tweets);
      
    } else if (type === 'user-mentions') {
      console.log(`Fetching mentions for ${username}`);
      
      // Search for mentions of the user
      const mentionsResponse = await fetch(
        `https://api.twitter.com/2/tweets/search/recent?query=@${username}&max_results=10&tweet.fields=created_at,public_metrics,author_id&user.fields=profile_image_url,verified&expansions=author_id`,
        {
          headers: {
            'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!mentionsResponse.ok) {
        const errorText = await mentionsResponse.text();
        console.error(`Failed to fetch mentions: ${mentionsResponse.status} - ${errorText}`);
        throw new Error(`Failed to fetch mentions: ${mentionsResponse.statusText}`);
      }

      tweets = await mentionsResponse.json();
      console.log('Mentions response:', tweets);
    } else {
      throw new Error(`Invalid type parameter: ${type}`);
    }

    console.log('Twitter API Response:', JSON.stringify(tweets, null, 2));

    return new Response(JSON.stringify(tweets), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in twitter-api function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
