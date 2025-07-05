
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

// Rate limiting - don't fetch more frequently than every 5 minutes per user
const lastFetchTimes = new Map<string, number>();
const FETCH_COOLDOWN = 5 * 60 * 1000; // 5 minutes

function canFetchUser(username: string): boolean {
  const lastFetch = lastFetchTimes.get(username) || 0;
  const now = Date.now();
  return (now - lastFetch) >= FETCH_COOLDOWN;
}

function setLastFetchTime(username: string): void {
  lastFetchTimes.set(username, Date.now());
}

export const fetchCombinedTweets = async (): Promise<CombinedTweet[]> => {
  const allTweets: CombinedTweet[] = [];
  const results: Array<{ username: string; tweets: CombinedTweet[]; error?: string }> = [];
  
  // Process users sequentially to avoid overwhelming the API
  for (const user of TWITTER_USERS) {
    try {
      // Check if we can fetch for this user (rate limiting)
      if (!canFetchUser(user.username)) {
        const timeRemaining = FETCH_COOLDOWN - (Date.now() - (lastFetchTimes.get(user.username) || 0));
        console.log(`Skipping ${user.username} - cooldown active for ${Math.round(timeRemaining / 1000)}s more`);
        results.push({ username: user.username, tweets: [], error: 'Rate limited' });
        continue;
      }

      console.log(`Fetching tweets for ${user.username}...`);
      
      const { data, error } = await supabase.functions.invoke('fetch-tweets', {
        body: { username: user.username }
      });

      // Mark this user as fetched regardless of success/failure
      setLastFetchTime(user.username);

      if (error) {
        console.error(`Supabase function error for ${user.username}:`, error);
        results.push({ username: user.username, tweets: [], error: error.message });
        continue;
      }

      if (!data) {
        console.warn(`No data returned for ${user.username}`);
        results.push({ username: user.username, tweets: [], error: 'No data returned' });
        continue;
      }

      // Handle rate limited responses
      if (data.rateLimited) {
        console.log(`Rate limited response for ${user.username}`);
        results.push({ username: user.username, tweets: [], error: 'Twitter API rate limited' });
        continue;
      }

      if (!data.tweets || !Array.isArray(data.tweets)) {
        console.warn(`Invalid tweets data for ${user.username}:`, data);
        results.push({ username: user.username, tweets: [], error: 'Invalid response format' });
        continue;
      }

      // Add source information to each tweet
      const tweetsWithSource = data.tweets.map((tweet: any) => ({
        ...tweet,
        source: user.displayName
      }));

      console.log(`Successfully fetched ${tweetsWithSource.length} tweets for ${user.username}`);
      results.push({ username: user.username, tweets: tweetsWithSource, error: undefined });
      allTweets.push(...tweetsWithSource);

      // Add a small delay between users to be nice to the API
      if (TWITTER_USERS.indexOf(user) < TWITTER_USERS.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
      }

    } catch (error) {
      console.error(`Failed to fetch tweets for ${user.username}:`, error);
      results.push({ username: user.username, tweets: [], error: error.message });
    }
  }

  // Log summary
  const successCount = results.filter(r => !r.error).length;
  const totalTweets = allTweets.length;
  console.log(`Fetch summary: ${successCount}/${TWITTER_USERS.length} users successful, ${totalTweets} total tweets`);

  // Sort all tweets by created_at in descending order (most recent first)
  return allTweets.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
};
