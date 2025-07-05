
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, RefreshCw, Twitter, Clock, TrendingUp, Users } from 'lucide-react';
import { fetchCombinedTweets, CombinedTweet, TWITTER_USERS } from '@/services/combinedFeedService';
import { useToast } from '@/hooks/use-toast';

const CombinedFeed = () => {
  const [tweets, setTweets] = useState<CombinedTweet[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { toast } = useToast();

  const loadTweets = async () => {
    try {
      setLoading(true);
      const fetchedTweets = await fetchCombinedTweets();
      setTweets(fetchedTweets);
      setLastUpdated(new Date());
      
      if (fetchedTweets.length > 0) {
        toast({
          title: "Feed Updated",
          description: `Loaded ${fetchedTweets.length} tweets from ${TWITTER_USERS.length} users`,
        });
      } else {
        toast({
          title: "No Tweets Found",
          description: "No recent posts available from configured users",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading combined tweets:', error);
      toast({
        title: "Connection Error",
        description: "Unable to fetch live data. Please check your Twitter API configuration.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadTweets();
  }, []);

  // Auto-refresh every 2 minutes
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoRefresh) {
      interval = setInterval(() => {
        console.log('Auto-refreshing combined feed...');
        loadTweets();
      }, 2 * 60 * 1000); // 2 minutes
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Controls */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Twitter className="w-6 h-6 text-blue-400" />
              Combined Twitter Feed
            </CardTitle>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                {autoRefresh ? 'Live' : 'Manual'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={loadTweets}
                disabled={loading}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : 'Never updated'}
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Following {TWITTER_USERS.length} users:</span>
              {TWITTER_USERS.map((user, index) => (
                <Badge key={user.username} className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
                  @{user.username}
                </Badge>
              ))}
            </div>
            <Badge className={`${autoRefresh ? 'bg-green-500/10 text-green-400' : 'bg-slate-500/10 text-slate-400'} border-slate-700`}>
              {autoRefresh ? 'Auto-refresh ON (2min)' : 'Auto-refresh OFF'}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Loading State */}
      {loading && tweets.length === 0 && (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-8 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-400" />
            <p className="text-slate-400">Loading latest tweets from all users...</p>
          </CardContent>
        </Card>
      )}

      {/* No Tweets State */}
      {tweets.length === 0 && !loading && (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-8 text-center">
            <Twitter className="w-12 h-12 mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400 mb-4">No recent posts available</p>
            <p className="text-sm text-slate-500">
              Configure your Twitter API credentials to see live data from {TWITTER_USERS.length} users
            </p>
            <div className="mt-4 text-xs text-slate-600">
              {/* Instructions for adding new users:
                  To add a new user to the feed, edit TWITTER_USERS array in src/services/combinedFeedService.ts
                  Example: { username: "newuser", displayName: "New User Display Name" }
              */}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Combined Tweets Feed */}
      <div className="space-y-4">
        {tweets.map((tweet) => (
          <Card key={`${tweet.author.username}-${tweet.id}`} className="bg-slate-900/50 border-slate-800 hover:bg-slate-900/70 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <img
                  src={tweet.author.profile_image_url}
                  alt={tweet.author.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-700"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="font-semibold text-white">{tweet.author.name}</span>
                    <span className="text-slate-400 text-sm">@{tweet.author.username}</span>
                    <span className="text-slate-500 text-sm">•</span>
                    <span className="text-slate-500 text-sm">{formatTimeAgo(tweet.created_at)}</span>
                    <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs ml-auto">
                      {tweet.source}
                    </Badge>
                  </div>
                  
                  <p className="text-slate-200 mb-3 leading-relaxed">{tweet.text}</p>
                  
                  {tweet.media && tweet.media.length > 0 && (
                    <div className="mb-3 space-y-2">
                      {tweet.media.map((media, index) => (
                        <div key={index}>
                          {media.type === 'photo' && (
                            <img
                              src={media.url}
                              alt="Tweet media"
                              className="rounded-lg max-w-full h-auto border border-slate-700"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <a
                    href={tweet.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on X
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer with user addition instructions */}
      {tweets.length > 0 && (
        <div className="text-center text-slate-500 text-sm mt-8">
          <p>Combined feed from {TWITTER_USERS.length} Twitter accounts</p>
          <p className="text-xs mt-2">
            To add more users, edit the TWITTER_USERS array in src/services/combinedFeedService.ts
          </p>
        </div>
      )}
    </div>
  );
};

export default CombinedFeed;
