
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
  const allTweets: CombinedTweet[] = [];
  
  // Fetch tweets from all configured users
  const fetchPromises = TWITTER_USERS.map(async (user) => {
    try {
      console.log(`Fetching tweets for ${user.username}...`);
      
      const { data, error } = await supabase.functions.invoke('fetch-tweets', {
        body: { username: user.username }
      });

      if (error) {
        console.error(`Error fetching tweets for ${user.username}:`, error);
        return [];
      }

      if (!data || !data.tweets) {
        console.warn(`No tweets data for ${user.username}`);
        return [];
      }

      // Add source information to each tweet
      const tweetsWithSource = data.tweets.map((tweet: any) => ({
        ...tweet,
        source: user.displayName
      }));

      console.log(`Successfully fetched ${tweetsWithSource.length} tweets for ${user.username}`);
      return tweetsWithSource;
    } catch (error) {
      console.error(`Failed to fetch tweets for ${user.username}:`, error);
      return [];
    }
  });

  // Wait for all promises to resolve, even if some fail
  const results = await Promise.allSettled(fetchPromises);
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      allTweets.push(...result.value);
    } else {
      console.error(`Failed to fetch tweets for ${TWITTER_USERS[index].username}:`, result.reason);
    }
  });

  // Sort all tweets by created_at in descending order (most recent first)
  return allTweets.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
};
