
import React from 'react';
import Header from '@/components/Header';
import StatsGrid from '@/components/StatsGrid';
import ActivityFeed from '@/components/ActivityFeed';
import TwitterIntegrationStatus from '@/components/TwitterIntegrationStatus';
import { useTwitterData } from '@/hooks/useTwitterData';
import { stats, recentUpdates } from '@/data/mockData';

const Index = () => {
  const username = 'yashchitneni'; // You can make this dynamic later
  const { 
    data: twitterData, 
    isLoading, 
    error, 
    isEnabled, 
    setIsEnabled 
  } = useTwitterData(username);

  // Use Twitter data if enabled and available, otherwise fall back to mock data
  const displayData = isEnabled && twitterData.length > 0 ? twitterData : recentUpdates;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        <TwitterIntegrationStatus 
          isEnabled={isEnabled}
          onToggle={setIsEnabled}
          isLoading={isLoading}
          error={error}
        />
        
        <StatsGrid stats={stats} />
        <ActivityFeed updates={displayData} />
        
        <div className="text-center text-slate-500 text-sm">
          <p>PersonalX Followers Dashboard - Your private social monitoring tool</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
