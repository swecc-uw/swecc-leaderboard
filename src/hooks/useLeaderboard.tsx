import { useEffect, useState } from 'react';
import { LeaderboardType, Ordering, LeaderboardEntry } from '../types';
import { useToast } from '@chakra-ui/react';
import { getLeaderboardDataHandlerFromType } from '../services/leaderboard';
import { assertTypeAndOrderingIntegrity } from '../utils';
import { devPrint } from '../components/utils/RandomUtils';

interface CacheEntry {
  data: LeaderboardEntry[];
  next: string | null;
  previous: string | null;
  timestamp: number;
}

const leaderboardCache = new Map<string, CacheEntry>();
// Arbitrary expiration granularity
const CACHE_EXPIRATION_MS = 10 * 60 * 1000; // 10 minutes

export const useLeaderboard = (
  type: LeaderboardType,
  order: Ordering,
  pageUrl?: string
) => {
  const cacheKey = `${type}-${order}-${pageUrl}`;
  const cachedEntry = leaderboardCache.get(cacheKey);
  const isCacheValid =
    cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_EXPIRATION_MS;

  const [isLoading, setIsLoading] = useState<boolean>(!isCacheValid);
  const [error, setError] = useState<string>();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    cachedEntry?.data || []
  );
  const toast = useToast();

  const [nextPage, setNextPage] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);

  const fetchData = async () => {
    const cachedEntry = leaderboardCache.get(cacheKey);
    const now = Date.now();

    if (cachedEntry && now - cachedEntry.timestamp < CACHE_EXPIRATION_MS) {
      setLeaderboardData(cachedEntry.data);
      setNextPage(cachedEntry.next);
      setPreviousPage(cachedEntry.previous);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      devPrint(pageUrl);
      const paginatedResponse = await getLeaderboardDataHandlerFromType(type)(
        order,
        pageUrl
      );
      devPrint(paginatedResponse);
      if (paginatedResponse.data) {
        setLeaderboardData(paginatedResponse.data);
        leaderboardCache.set(cacheKey, {
          timestamp: now,
          ...paginatedResponse,
        });
      }
      setNextPage(paginatedResponse.next);
      setPreviousPage(paginatedResponse.previous);
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
  }, [order, type, pageUrl]);

  // Only for dev
  if (import.meta.env.DEV && !assertTypeAndOrderingIntegrity(type, order)) {
    return {
      isLoading: false,
      error: 'Invalid ordering for provided leaderboard',
      leaderboardData: [],
    };
  }

  return { isLoading, error, leaderboardData, nextPage, previousPage };
};
