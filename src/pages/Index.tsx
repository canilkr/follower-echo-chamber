
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import MinerviniProfile from '@/components/MinerviniProfile';
import MinerviniStats from '@/components/MinerviniStats';
import TwitterFeed from '@/components/TwitterFeed';

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Trading Insights Dashboard
                </h1>
                <p className="text-sm text-slate-400">Real-time trading insights and market analysis</p>
              </div>
            </div>
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
              Live Data
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Profile Section */}
        <MinerviniProfile />
        
        {/* Stats Section */}
        <MinerviniStats />
        
        {/* Twitter Feeds Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div>
            <TwitterFeed 
              username="markminervini" 
              displayName="Mark Minervini"
              autoRefresh={true}
            />
          </div>
          <div>
            <TwitterFeed 
              username="yashchitneni" 
              displayName="Yash Chitneni"
              autoRefresh={true}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-slate-500 text-sm mt-12">
          <p>Trading Insights Dashboard - Real-time market analysis from top traders</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
