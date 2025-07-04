
import { TwitterApiResponse, ProcessedTwitterActivity } from '@/types/twitter';

// This service will interact with your Supabase Edge Functions
export class TwitterService {
  private baseUrl = '/api/twitter'; // This will be your Supabase Edge Function URL

  async fetchUserTweets(username: string): Promise<ProcessedTwitterActivity[]> {
    try {
      const response = await fetch(`${this.baseUrl}/user-tweets/${username}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch tweets: ${response.statusText}`);
      }
      
      const data: TwitterApiResponse = await response.json();
      return this.processTwitterData(data);
    } catch (error) {
      console.error('Error fetching user tweets:', error);
      throw error;
    }
  }

  async fetchUserMentions(username: string): Promise<ProcessedTwitterActivity[]> {
    try {
      const response = await fetch(`${this.baseUrl}/user-mentions/${username}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch mentions: ${response.statusText}`);
      }
      
      const data: TwitterApiResponse = await response.json();
      return this.processTwitterData(data);
    } catch (error) {
      console.error('Error fetching user mentions:', error);
      throw error;
    }
  }

  private processTwitterData(apiResponse: TwitterApiResponse): ProcessedTwitterActivity[] {
    if (!apiResponse.data) return [];

    const users = apiResponse.includes?.users || [];
    const userMap = new Map(users.map(user => [user.id, user]));

    return apiResponse.data.map(tweet => {
      const author = userMap.get(tweet.author_id);
      const isRetweet = tweet.referenced_tweets?.some(ref => ref.type === 'retweeted');
      
      return {
        id: tweet.id,
        username: `@${author?.username || 'unknown'}`,
        displayName: author?.name || 'Unknown User',
        action: isRetweet ? 'retweeted' : 'tweeted',
        content: tweet.text,
        timestamp: this.formatTimestamp(tweet.created_at),
        type: isRetweet ? 'retweet' : 'tweet',
        avatar: author?.profile_image_url || '/placeholder.svg',
        engagement: {
          likes: tweet.public_metrics.like_count,
          retweets: tweet.public_metrics.retweet_count,
          replies: tweet.public_metrics.reply_count,
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
