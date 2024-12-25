import { Flex, Spinner, Text, Box } from '@chakra-ui/react';
import React from 'react';
import { GitHubOrderBy, LeaderboardType } from '../types';
import Leaderboard from './Leaderboard';
import { OrderBySelect } from './OrderBySelect';
import { useState } from 'react';
import { getGithubProfileURL, lastUpdated } from '../utils';
import { useLeaderboard } from '../hooks/useLeaderboard';

export const GithubLeaderboard: React.FC = () => {
  const [githubOrder, setGithubOrder] = useState<GitHubOrderBy>(
    GitHubOrderBy.Commits
  );

  const {
    isLoading,
    error,
    leaderboardData: githubData,
  } = useLeaderboard(LeaderboardType.GitHub, githubOrder);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="400px">
        <Spinner size="lg" color="blue.500" thickness="3px" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" align="center" h="400px">
        <Text color="red.500">Failed to load leaderboard data</Text>
      </Flex>
    );
  }

  const githubOptions = [
    { value: GitHubOrderBy.Commits, label: 'Total Commits' },
    { value: GitHubOrderBy.Prs, label: 'Pull Requests' },
    { value: GitHubOrderBy.Followers, label: 'Followers' },
  ];

  const headers = [
    { key: 'rank', label: 'Rank' },
    { key: 'username', label: 'Username' },
    { key: 'totalCommits', label: 'Commits' },
    { key: 'totalPrs', label: 'PRs' },
    { key: 'followers', label: 'Followers' },
  ];

  const orderColKey = (order: GitHubOrderBy) => {
    switch (order) {
      case GitHubOrderBy.Commits:
        return 'totalCommits';
      case GitHubOrderBy.Prs:
        return 'totalPrs';
      case GitHubOrderBy.Followers:
        return 'followers';
      default:
        return '';
    }
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="sm" color="gray.500">
          Last updated: {lastUpdated(githubData)}
        </Text>
        <OrderBySelect
          value={githubOrder}
          onChange={(value) => {
            setGithubOrder(value as GitHubOrderBy);
          }}
          options={githubOptions}
        />
      </Flex>
      <Box>
        <Leaderboard
          data={githubData}
          orderBy={githubOrder}
          orderColKey={orderColKey(githubOrder)}
          headers={headers}
          externalLinkConstruct={getGithubProfileURL}
        />
      </Box>
    </Box>
  );
};
