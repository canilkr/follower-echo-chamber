
import { supabase } from '@/integrations/supabase/client';

export interface MinerviniTweet {
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

export const fetchMinerviniTweets = async (): Promise<MinerviniTweet[]> => {
  try {
    console.log('Fetching Mark Minervini tweets...');
    
    const { data, error } = await supabase.functions.invoke('minervini-tweets', {
      body: { username: 'markminervini' }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(`Failed to fetch tweets: ${error.message}`);
    }

    if (!data || !data.tweets) {
      console.error('No data received from function');
      throw new Error('No tweet data received');
    }

    console.log('Successfully fetched tweets:', data.tweets.length);
    return data.tweets;
  } catch (error) {
    console.error('Error fetching Minervini tweets:', error);
    throw error;
  }
};
