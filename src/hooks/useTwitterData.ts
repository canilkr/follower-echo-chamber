
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { twitterService } from '@/services/twitterService';
import { ProcessedTwitterActivity } from '@/types/twitter';

export const useTwitterData = (username: string) => {
  const [isEnabled, setIsEnabled] = useState(false);

  // Fetch user tweets
  const tweetsQuery = useQuery({
    queryKey: ['twitter-tweets', username],
    queryFn: () => twitterService.fetchUserTweets(username),
    enabled: isEnabled && !!username,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
  });

  // Fetch mentions
  const mentionsQuery = useQuery({
    queryKey: ['twitter-mentions', username],
    queryFn: () => twitterService.fetchUserMentions(username),
    enabled: isEnabled && !!username,
    refetchInterval: 5 * 60 * 1000,
    staleTime: 2 * 60 * 1000,
  });

  const combinedData: ProcessedTwitterActivity[] = [
    ...(tweetsQuery.data || []),
    ...(mentionsQuery.data || [])
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return {
    data: combinedData,
    isLoading: tweetsQuery.isLoading || mentionsQuery.isLoading,
    error: tweetsQuery.error || mentionsQuery.error,
    isEnabled,
    setIsEnabled,
    refetch: () => {
      tweetsQuery.refetch();
      mentionsQuery.refetch();
    }
  };
};
