
import React from 'react';
import { Users, MessageCircle, Heart, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Stats } from '@/types/activity';

interface StatsGridProps {
  stats: Stats;
}

const StatsGrid = ({ stats }: StatsGridProps) => {
  return (
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
  );
};

export default StatsGrid;
