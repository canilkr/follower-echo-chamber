
import { supabase } from '@/integrations/supabase/client';
import { TwitterApiResponse, ProcessedTwitterActivity } from '@/types/twitter';

export class TwitterService {
  async fetchUserTweets(username: string): Promise<ProcessedTwitterActivity[]> {
    try {
      console.log(`Fetching tweets for ${username}`);
      
      const { data, error } = await supabase.functions.invoke('twitter-api', {
        body: { username, type: 'user-tweets' }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Failed to fetch tweets: ${error.message}`);
      }

      console.log('Raw Twitter API response:', data);
      return this.processTwitterData(data, username);
    } catch (error) {
      console.error('Error fetching user tweets:', error);
      throw error;
    }
  }

  async fetchUserMentions(username: string): Promise<ProcessedTwitterActivity[]> {
    try {
      console.log(`Fetching mentions for ${username}`);
      
      const { data, error } = await supabase.functions.invoke('twitter-api', {
        body: { username, type: 'user-mentions' }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Failed to fetch mentions: ${error.message}`);
      }

      console.log('Raw Twitter mentions response:', data);
      return this.processTwitterData(data, username);
    } catch (error) {
      console.error('Error fetching user mentions:', error);
      throw error;
    }
  }

  private processTwitterData(apiResponse: any, targetUsername: string): ProcessedTwitterActivity[] {
    if (!apiResponse || !apiResponse.data) {
      console.log('No data in API response');
      return [];
    }

    const tweets = apiResponse.data;
    const users = apiResponse.includes?.users || [];
    const userMap = new Map(users.map((user: any) => [user.id, user]));

    return tweets.map((tweet: any) => {
      const author = userMap.get(tweet.author_id);
      const isRetweet = tweet.referenced_tweets?.some((ref: any) => ref.type === 'retweeted');
      const isMention = tweet.text.includes(`@${targetUsername}`);
      
      let action: 'tweeted' | 'retweeted' | 'liked' | 'replied' = 'tweeted';
      let type: 'tweet' | 'retweet' | 'like' | 'reply' = 'tweet';
      
      if (isRetweet) {
        action = 'retweeted';
        type = 'retweet';
      } else if (isMention) {
        action = 'replied';
        type = 'reply';
      }

      return {
        id: tweet.id,
        username: `@${author?.username || 'unknown'}`,
        displayName: author?.name || 'Unknown User',
        action,
        content: tweet.text,
        timestamp: this.formatTimestamp(tweet.created_at),
        type,
        avatar: author?.profile_image_url || '/placeholder.svg',
        engagement: {
          likes: tweet.public_metrics?.like_count || 0,
          retweets: tweet.public_metrics?.retweet_count || 0,
          replies: tweet.public_metrics?.reply_count || 0,
        }
      };
    });
  }

  private formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffInMinutes / 1440)} day${Math.floor(diffInMinutes / 1440) > 1 ? 's' : ''} ago`;
  }
}

export const twitterService = new TwitterService();
