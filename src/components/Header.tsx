
import React from 'react';
import { Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                PersonalX Followers
              </h1>
              <p className="text-sm text-slate-400">Your private social dashboard</p>
            </div>
          </div>
          <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
            Live
          </Badge>
        </div>
      </div>
    </header>
  );
};

export default Header;
