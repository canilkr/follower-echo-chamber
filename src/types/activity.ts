
export interface ActivityUpdate {
  id: number;
  username: string;
  displayName: string;
  action: string;
  content: string;
  timestamp: string;
  type: 'comment' | 'like' | 'retweet';
  avatar: string;
}

export interface Stats {
  totalFollowers: number;
  activeToday: number;
  newComments: number;
  engagementRate: number;
}
