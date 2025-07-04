
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Award, BookOpen } from 'lucide-react';

const MinerviniProfile = () => {
  return (
    <Card className="bg-slate-900/50 border-slate-800 mb-8">
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-white">Mark Minervini</h2>
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                @markminervini
              </Badge>
            </div>
            <p className="text-slate-300 mb-4 leading-relaxed">
              Stock Market Wizard • 3x US Investing Champion • Author of "Think & Trade Like a Champion" 
              • Providing insights on market trends, trading strategies, and investment opportunities.
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                <span>3x Champion</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>Author</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>Market Wizard</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MinerviniProfile;
