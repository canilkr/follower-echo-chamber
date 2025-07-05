
import { supabase } from '@/integrations/supabase/client';

export interface Tweet {
  id: string;
  text: string;
  created_at: string;
  media?: {
    type: string;
    url: string;
  }[];
  url: string;
  author: {
    username: string;
    name: string;
    profile_image_url: string;
  };
}

export const fetchTweets = async (username: string): Promise<Tweet[]> => {
  try {
    console.log(`Fetching tweets for ${username}...`);
    
    const { data, error } = await supabase.functions.invoke('fetch-tweets', {
      body: { username }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(`Failed to fetch tweets: ${error.message}`);
    }

    if (!data || !data.tweets) {
      console.error('No data received from function');
      throw new Error('No tweet data received');
    }

    console.log(`Successfully fetched tweets for ${username}:`, data.tweets.length);
    return data.tweets;
  } catch (error) {
    console.error(`Error fetching tweets for ${username}:`, error);
    throw error;
  }
};
