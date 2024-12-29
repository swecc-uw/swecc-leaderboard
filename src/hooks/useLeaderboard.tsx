import { useEffect, useState } from 'react';
import { LeaderboardType, Ordering, LeaderboardEntry } from '../types';
import { useToast } from '@chakra-ui/react';
import { getLeaderboardDataHandlerFromType } from '../services/leaderboard';
import { assertTypeAndOrderingIntegrity } from '../utils';

interface CacheEntry {
  data: LeaderboardEntry[];
  timestamp: number;
}

const leaderboardCache = new Map<string, CacheEntry>();
// Arbitrary expiration granularity
const CACHE_EXPIRATION_MS = 10 * 60 * 1000; // 10 minutes

export const useLeaderboard = (type: LeaderboardType, order: Ordering) => {
  const cacheKey = `${type}-${order}`;
  const cachedEntry = leaderboardCache.get(cacheKey);
  const isCacheValid =
    cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_EXPIRATION_MS;

  const [isLoading, setIsLoading] = useState<boolean>(!isCacheValid);
  const [error, setError] = useState<string>();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    cachedEntry?.data || []
  );
  const toast = useToast();

  const fetchData = async () => {
    const cachedEntry = leaderboardCache.get(cacheKey);
    const now = Date.now();

    if (cachedEntry && now - cachedEntry.timestamp < CACHE_EXPIRATION_MS) {
      setLeaderboardData(cachedEntry.data);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      const data = await getLeaderboardDataHandlerFromType(type)(order);
      if (data) {
        setLeaderboardData(data);
        leaderboardCache.set(cacheKey, { data, timestamp: now });
      }
    } catch (e) {
      const errorMessage = (e as Error).message;
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [order, type]);

  // Only for dev
  if (import.meta.env.DEV && !assertTypeAndOrderingIntegrity(type, order)) {
    return {
      isLoading: false,
      error: 'Invalid ordering for provided leaderboard',
      leaderboardData: [],
    };
  }

  return { isLoading, error, leaderboardData };
};
