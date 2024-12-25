import { useEffect, useState } from 'react';
import {
  LeaderboardType,
  LeaderboardDataHandler,
  Ordering,
  LeaderboardEntry,
} from '../types';
import { useToast } from '@chakra-ui/react';
import {
  getGitHubLeaderboard,
  getInternshipLeaderboard,
  getLeetcodeLeaderboard,
  getNewGradLeaderboard,
} from '../services/leaderboard';
import { assertTypeAndOrderingIntegrity } from '../utils';

const getLeaderboardDataHandlerFromType = (
  type: LeaderboardType
): LeaderboardDataHandler => {
  switch (type) {
    case LeaderboardType.LeetCode:
      return getLeetcodeLeaderboard as LeaderboardDataHandler;
    case LeaderboardType.GitHub:
      return getGitHubLeaderboard as LeaderboardDataHandler;
    case LeaderboardType.InternshipApplications:
      return getInternshipLeaderboard as LeaderboardDataHandler;
    case LeaderboardType.NewGradApplications:
      return getNewGradLeaderboard as LeaderboardDataHandler;
    default:
      throw new Error('Invalid leaderboard type was provided');
  }
};

export const useLeaderboard = (type: LeaderboardType, order: Ordering) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const toast = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      const data = await getLeaderboardDataHandlerFromType(type)(order);
      // Success
      if (data) {
        setLeaderboardData(data);
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
