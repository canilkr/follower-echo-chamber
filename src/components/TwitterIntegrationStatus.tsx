
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Twitter, AlertCircle, CheckCircle } from 'lucide-react';

interface TwitterIntegrationStatusProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  isLoading?: boolean;
  error?: Error | null;
}

const TwitterIntegrationStatus = ({ 
  isEnabled, 
  onToggle, 
  isLoading = false, 
  error = null 
}: TwitterIntegrationStatusProps) => {
  return (
    <Card className="bg-slate-900/50 border-slate-800 mb-6">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Twitter className="w-5 h-5 text-blue-400" />
          Twitter Integration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isEnabled ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-slate-300">Live Twitter data enabled</span>
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                  Active
                </Badge>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <span className="text-slate-300">Using mock data</span>
                <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                  Demo Mode
                </Badge>
              </>
            )}
          </div>
          
          <Button
            onClick={() => onToggle(!isEnabled)}
            disabled={isLoading}
            variant={isEnabled ? "destructive" : "default"}
            size="sm"
          >
            {isLoading ? 'Loading...' : isEnabled ? 'Disable Live Data' : 'Enable Live Data'}
          </Button>
        </div>
        
        {error && (
          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">
              Error: {error.message}
            </p>
            <p className="text-slate-400 text-xs mt-1">
              Please check your Supabase Edge Function configuration
            </p>
          </div>
        )}
        
        {!isEnabled && (
          <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-blue-400 text-sm">
              To enable live Twitter data, you need to set up Supabase Edge Functions with Twitter API credentials.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TwitterIntegrationStatus;
