import { useEffect, useState } from 'react';
import {
  LeaderboardType,
  LeetCodeStats,
  GitHubStats,
  ApplicationStats,
  GitHubOrderBy,
  LeetCodeOrderBy,
  ApplicationOrderBy,
} from '../types';
import { useToast } from '@chakra-ui/react';
import {
  getGitHubLeaderboard,
  getInternshipLeaderboard,
  getLeetcodeLeaderboard,
  getNewGradLeaderboard,
} from '../services/leaderboard';

type AllOrderings = GitHubOrderBy | LeetCodeOrderBy | ApplicationOrderBy;
type AllLeaderboardData = GitHubStats[] | LeetCodeStats[] | ApplicationStats[];
type LeaderboardDataHandler = (
  order: AllOrderings
) => Promise<AllLeaderboardData>;

const getLeaderboardBasedOnType = (
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
      return async (_) => [];
  }
};

export const useLeaderboard = (type: LeaderboardType, order: AllOrderings) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [leaderboardData, setLeaderboardData] = useState<AllLeaderboardData>(
    []
  );

  const toast = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    setError(undefined);

    const data = await getLeaderboardBasedOnType(type)(order);

    // Success
    if (data) {
      setLeaderboardData(data);
      setIsLoading(false);
      return;
    }

    // Error
    setError('Failed to fetch GitHub leaderboard data');

    toast({
      title: 'Error',
      description: 'Failed to fetch GitHub leaderboard data',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [order]);

  return { isLoading, error, leaderboardData };
};
