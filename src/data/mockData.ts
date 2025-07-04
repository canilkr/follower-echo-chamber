
import { ActivityUpdate, Stats } from '@/types/activity';

export const stats: Stats = {
  totalFollowers: 1247,
  activeToday: 89,
  newComments: 23,
  engagementRate: 4.2
};

export const recentUpdates: ActivityUpdate[] = [
  {
    id: '1', // Changed from number to string
    username: '@yashchitneni',
    displayName: 'Yash Chitneni',
    action: 'commented',
    content: 'Really insightful thread about building in public! Your transparency is inspiring.',
    timestamp: '5 minutes ago',
    type: 'comment',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: '2', // Changed from number to string
    username: '@markminervini',
    displayName: 'Mark Minervini',
    action: 'retweeted',
    content: 'Your latest post about product strategy',
    timestamp: '12 minutes ago',
    type: 'retweet',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: '3', // Changed from number to string
    username: '@yashchitneni',
    displayName: 'Yash Chitneni',
    action: 'liked',
    content: 'Your recent insights on startup growth',
    timestamp: '45 minutes ago',
    type: 'like',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: '4', // Changed from number to string
    username: '@markminervini',
    displayName: 'Mark Minervini',
    action: 'commented',
    content: 'Love this approach! Would be great to connect and discuss this further.',
    timestamp: '1 hour ago',
    type: 'comment',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: '5', // Changed from number to string
    username: '@yashchitneni',
    displayName: 'Yash Chitneni',
    action: 'retweeted',
    content: 'Your post about the future of AI in product development',
    timestamp: '2 hours ago',
    type: 'retweet',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
  }
];
