import { Flex, Spinner, Text, Box, useToast } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { GitHubOrderBy, GitHubStats } from '../types';
import Leaderboard from './Leaderboard';
import { OrderBySelect } from './OrderBySelect';
import { useState } from 'react';
import { getGitHubLeaderboard } from '../services/leaderboard';
import { getGithubProfileURL, lastUpdated } from '../utils';

interface Props {}

export const GithubLeaderboard: React.FC<Props> = () => {
  const [githubOrder, setGithubOrder] = useState<GitHubOrderBy>(
    GitHubOrderBy.Commits
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();
  const [githubData, setGithubData] = useState<GitHubStats[]>([]);

  const toast = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    setError(undefined);

    const data = await getGitHubLeaderboard(githubOrder);

    // Success
    if (data) {
      setGithubData(data);
      setIsLoading(false);
      return;
    }

    // Error
    setError('Failed to fetch leetcode leaderboard data');

    toast({
      title: 'Error',
      description: 'Failed to fetch leetcode leaderboard data',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [githubOrder]);

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
