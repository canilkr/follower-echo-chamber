import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, RefreshCw, Twitter, Clock, TrendingUp } from 'lucide-react';
import { fetchMinerviniTweets, MinerviniTweet } from '@/services/minerviniService';
import { useToast } from '@/hooks/use-toast';

const MinerviniFeed = () => {
  const [tweets, setTweets] = useState<MinerviniTweet[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const { toast } = useToast();

  const loadTweets = async () => {
    try {
      setLoading(true);
      const fetchedTweets = await fetchMinerviniTweets();
      setTweets(fetchedTweets);
      setLastUpdated(new Date());
      
      if (fetchedTweets.length > 0) {
        toast({
          title: "Feed Updated",
          description: `Loaded ${fetchedTweets.length} tweets from Mark Minervini`,
        });
      }
    } catch (error) {
      console.error('Error loading tweets:', error);
      toast({
        title: "Connection Error",
        description: "Unable to fetch live data. Please check your Twitter API configuration.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTweets();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoRefresh) {
      interval = setInterval(() => {
        loadTweets();
      }, 10 * 60 * 1000); // Refresh every 10 minutes
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
    <div className="space-y-6">
      {/* Header Controls */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Twitter className="w-6 h-6 text-blue-400" />
              Mark Minervini Feed
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
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : 'Never updated'}
            </div>
            <Badge className={`${autoRefresh ? 'bg-green-500/10 text-green-400' : 'bg-slate-500/10 text-slate-400'} border-slate-700`}>
              {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Tweets Feed */}
      <div className="space-y-4">
        {loading && tweets.length === 0 && (
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-8 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-400" />
              <p className="text-slate-400">Loading Mark Minervini's latest tweets...</p>
            </CardContent>
          </Card>
        )}

        {tweets.length === 0 && !loading && (
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-8 text-center">
              <Twitter className="w-12 h-12 mx-auto mb-4 text-slate-600" />
              <p className="text-slate-400 mb-4">No tweets available</p>
              <p className="text-sm text-slate-500">Configure your Twitter API credentials to see live data</p>
            </CardContent>
          </Card>
        )}

        {tweets.map((tweet) => (
          <Card key={tweet.id} className="bg-slate-900/50 border-slate-800 hover:bg-slate-900/70 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <img
                  src={tweet.author.profile_image_url}
                  alt={tweet.author.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-700"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-white">{tweet.author.name}</span>
                    <span className="text-slate-400 text-sm">@{tweet.author.username}</span>
                    <span className="text-slate-500 text-sm">•</span>
                    <span className="text-slate-500 text-sm">{formatTimeAgo(tweet.created_at)}</span>
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
    </div>
  );
};

export default MinerviniFeed;
