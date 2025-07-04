
import React from 'react';
import Header from '@/components/Header';
import StatsGrid from '@/components/StatsGrid';
import ActivityFeed from '@/components/ActivityFeed';
import { stats, recentUpdates } from '@/data/mockData';

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        <StatsGrid stats={stats} />
        <ActivityFeed updates={recentUpdates} />
        
        <div className="text-center text-slate-500 text-sm">
          <p>PersonalX Followers Dashboard - Your private social monitoring tool</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
