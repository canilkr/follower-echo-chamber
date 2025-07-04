
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
    const { username, type } = await req.json();
    
    if (!TWITTER_BEARER_TOKEN) {
      throw new Error('Twitter Bearer Token not configured');
    }

    let tweets;
    
    if (type === 'user-tweets') {
      // Get user ID first
      const userResponse = await fetch(`https://api.twitter.com/2/users/by/username/${username}`, {
        headers: {
          'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!userResponse.ok) {
        throw new Error(`Failed to fetch user: ${userResponse.statusText}`);
      }

      const userData = await userResponse.json();
      const userId = userData.data.id;

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
        throw new Error(`Failed to fetch tweets: ${tweetsResponse.statusText}`);
      }

      tweets = await tweetsResponse.json();
    } else if (type === 'user-mentions') {
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
        throw new Error(`Failed to fetch mentions: ${mentionsResponse.statusText}`);
      }

      tweets = await mentionsResponse.json();
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
