
export interface ActivityUpdate {
  id: string; // Changed from number to string to match Twitter data
  username: string;
  displayName: string;
  action: string;
  content: string;
  timestamp: string;
  type: 'comment' | 'like' | 'retweet' | 'tweet'; // Added 'tweet' type
  avatar: string;
}

export interface Stats {
  totalFollowers: number;
  activeToday: number;
  newComments: number;
  engagementRate: number;
}
