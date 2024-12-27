import { useEffect, useState } from 'react';
import { LeaderboardType, Ordering, LeaderboardEntry } from '../types';
import { useToast } from '@chakra-ui/react';
import { getLeaderboardDataHandlerFromType } from '../services/leaderboard';
import { assertTypeAndOrderingIntegrity } from '../utils';

const leaderboardCache = new Map<string, LeaderboardEntry[]>();

export const useLeaderboard = (type: LeaderboardType, order: Ordering) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const cacheKey = `${type}-${order}`;
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    leaderboardCache.get(cacheKey) || []
  );
  const toast = useToast();

  const fetchData = async () => {
    const cachedData = leaderboardCache.get(cacheKey);
    if (cachedData) {
      setLeaderboardData(cachedData);
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      const data = await getLeaderboardDataHandlerFromType(type)(order);
      if (data) {
        setLeaderboardData(data);
        leaderboardCache.set(cacheKey, data);
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
  }, [order]);

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
