
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, MessageCircle, Calendar } from 'lucide-react';

const MinerviniStats = () => {
  const stats = [
    {
      label: 'Trading Experience',
      value: '40+ Years',
      icon: Calendar,
      color: 'text-blue-400'
    },
    {
      label: 'Championship Wins',
      value: '3x US Champion',
      icon: TrendingUp,
      color: 'text-green-400'
    },
    {
      label: 'Books Published',
      value: 'Multiple',
      icon: MessageCircle,
      color: 'text-purple-400'
    },
    {
      label: 'Market Focus',
      value: 'Growth Stocks',
      icon: Users,
      color: 'text-red-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-slate-900/50 border-slate-800 hover:bg-slate-900/70 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">{stat.label}</p>
                <p className="text-xl font-bold text-white">{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MinerviniStats;
