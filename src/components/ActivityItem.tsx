
import React from 'react';
import { MessageCircle, Heart, Repeat2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ActivityUpdate } from '@/types/activity';

interface ActivityItemProps {
  update: ActivityUpdate;
}

const ActivityItem = ({ update }: ActivityItemProps) => {
  const getActionIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-blue-400" />;
      case 'like':
        return <Heart className="w-4 h-4 text-red-400" />;
      case 'retweet':
        return <Repeat2 className="w-4 h-4 text-green-400" />;
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

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800/70 transition-colors border border-slate-700/50">
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
  );
};

export default ActivityItem;
