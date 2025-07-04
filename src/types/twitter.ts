
export interface TwitterUser {
  id: string;
  username: string;
  name: string;
  profile_image_url: string;
  verified?: boolean;
}

export interface TwitterTweet {
  id: string;
  text: string;
  created_at: string;
  author_id: string;
  public_metrics: {
    retweet_count: number;
    like_count: number;
    reply_count: number;
    quote_count: number;
  };
  referenced_tweets?: Array<{
    type: 'retweeted' | 'quoted' | 'replied_to';
    id: string;
  }>;
}

export interface TwitterApiResponse {
  data: TwitterTweet[];
  includes?: {
    users: TwitterUser[];
  };
  meta: {
    newest_id: string;
    oldest_id: string;
    result_count: number;
  };
}

export interface ProcessedTwitterActivity {
  id: string;
  username: string;
  displayName: string;
  action: 'tweeted' | 'retweeted' | 'liked' | 'replied';
  content: string;
  timestamp: string;
  type: 'tweet' | 'retweet' | 'like' | 'reply';
  avatar: string;
  engagement: {
    likes: number;
    retweets: number;
    replies: number;
  };
}
