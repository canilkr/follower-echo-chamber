
import { supabase } from '@/integrations/supabase/client';

export interface CombinedTweet {
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
  source: string; // to track which user this tweet came from
}

export interface UserConfig {
  username: string;
  displayName: string;
}

// Configuration array for users - easily add new users here
export const TWITTER_USERS: UserConfig[] = [
  { username: "markminervini", displayName: "Mark Minervini" },
  { username: "yashchitneni", displayName: "Yash Chitneni" }
];

export const fetchCombinedTweets = async (): Promise<CombinedTweet[]> => {
  try {
    console.log('Fetching combined tweets from all users...');
    
    // Extract usernames for the API call
    const usernames = TWITTER_USERS.map(user => user.username);
    
    const { data, error } = await supabase.functions.invoke('fetch-tweets', {
      body: { usernames }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(error.message);
    }

    if (!data) {
      console.warn('No data returned from fetch-tweets function');
      return [];
    }

    // Handle rate limited responses
    if (data.rateLimited) {
      console.log('Twitter API rate limited');
      throw new Error('Twitter API rate limited. Please try again later.');
    }

    if (!data.tweets || !Array.isArray(data.tweets)) {
      console.warn('Invalid tweets data:', data);
      return [];
    }

    // Add source information to each tweet based on username
    const tweetsWithSource = data.tweets.map((tweet: any) => {
      const userConfig = TWITTER_USERS.find(user => user.username === tweet.author.username);
      return {
        ...tweet,
        source: userConfig?.displayName || tweet.author.name
      };
    });

    console.log(`Successfully fetched ${tweetsWithSource.length} tweets from ${usernames.length} users`);
    
    // Log summary if available
    if (data.summary) {
      console.log('Fetch summary:', data.summary);
    }

    return tweetsWithSource;

  } catch (error) {
    console.error('Failed to fetch combined tweets:', error);
    throw error;
  }
};
