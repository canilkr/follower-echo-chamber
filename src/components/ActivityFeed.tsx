
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ActivityUpdate } from '@/types/activity';
import ActivityItem from './ActivityItem';

interface ActivityFeedProps {
  updates: ActivityUpdate[];
}

const ActivityFeed = ({ updates }: ActivityFeedProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUpdates = updates.filter(update =>
    update.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    update.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
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

        <div className="space-y-4">
          {filteredUpdates.map((update) => (
            <ActivityItem key={update.id} update={update} />
          ))}
        </div>

        {filteredUpdates.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-400">No updates found matching your search.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
