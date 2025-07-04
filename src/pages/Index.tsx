
import React, { useState } from 'react';
import { Search, Users, MessageCircle, Heart, Retweet, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for demonstration
  const stats = {
    totalFollowers: 1247,
    activeToday: 89,
    newComments: 23,
    engagementRate: 4.2
  };

  const recentUpdates = [
    {
      id: 1,
      username: '@johndoe',
      displayName: 'John Doe',
      action: 'commented',
      content: 'Great insights on the latest tech trends! Really appreciate your perspective.',
      timestamp: '2 minutes ago',
      type: 'comment',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: 2,
      username: '@sarahsmith',
      displayName: 'Sarah Smith',
      action: 'retweeted',
      content: 'Your post about productivity hacks',
      timestamp: '15 minutes ago',
      type: 'retweet',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b667b3c4?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: 3,
      username: '@mikejohnson',
      displayName: 'Mike Johnson',
      action: 'liked',
      content: 'Your recent thread about AI developments',
      timestamp: '1 hour ago',
      type: 'like',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: 4,
      username: '@emilychen',
      displayName: 'Emily Chen',
      action: 'commented',
      content: 'Would love to collaborate on this project! DMing you now.',
      timestamp: '2 hours ago',
      type: 'comment',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
    }
  ];

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-blue-400" />;
      case 'like':
        return <Heart className="w-4 h-4 text-red-400" />;
      case 'retweet':
        return <Retweet className="w-4 h-4 text-green-400" />;
      default:
        return <MessageCircle className="w-4 h-4 text-blue-400" />;
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'comment':
        return 'bg-blue-500/10 text-blue-400';
      case 'like':
        return 'bg-red-500/10 text-red-400';
      case 'retweet':
        return 'bg-green-500/10 text-green-400';
      default:
        return 'bg-blue-500/10 text-blue-400';
    }
  };

  const filteredUpdates = recentUpdates.filter(update =>
    update.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    update.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  PersonalX Followers
                </h1>
                <p className="text-sm text-slate-400">Your private social dashboard</p>
              </div>
            </div>
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
              Live
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900/50 border-slate-800 hover:bg-slate-900/70 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Followers</p>
                  <p className="text-2xl font-bold text-white">{stats.totalFollowers.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 hover:bg-slate-900/70 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Active Today</p>
                  <p className="text-2xl font-bold text-white">{stats.activeToday}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 hover:bg-slate-900/70 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">New Comments</p>
                  <p className="text-2xl font-bold text-white">{stats.newComments}</p>
                </div>
                <MessageCircle className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 hover:bg-slate-900/70 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Engagement Rate</p>
                  <p className="text-2xl font-bold text-white">{stats.engagementRate}%</p>
                </div>
                <Heart className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="bg-slate-900/50 border-slate-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Search className="w-5 h-5" />
              Activity Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search updates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                />
              </div>
              <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                Filter
              </Button>
            </div>

            {/* Activity List */}
            <div className="space-y-4">
              {filteredUpdates.map((update) => (
                <div
                  key={update.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800/70 transition-colors border border-slate-700/50"
                >
                  <img
                    src={update.avatar}
                    alt={update.displayName}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-700"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white">{update.displayName}</span>
                      <span className="text-slate-400 text-sm">{update.username}</span>
                      <Badge className={`${getActionColor(update.type)} text-xs`}>
                        <span className="flex items-center gap-1">
                          {getActionIcon(update.type)}
                          {update.action}
                        </span>
                      </Badge>
                    </div>
                    <p className="text-slate-300 text-sm mb-2">{update.content}</p>
                    <span className="text-xs text-slate-500">{update.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>

            {filteredUpdates.length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-400">No updates found matching your search.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-slate-500 text-sm">
          <p>PersonalX Followers Dashboard - Your private social monitoring tool</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
