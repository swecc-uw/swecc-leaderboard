import { Flex, Spinner, Text, Box, Link } from '@chakra-ui/react';
import React, { useState } from 'react';
import {
  GitHubOrderBy,
  LeaderboardHeader,
  LeaderboardType,
  Row,
  SortDirection,
} from '../types';
import Leaderboard from './Leaderboard';
import { OrderBySelect } from './OrderBySelect';
import { getGithubProfileURL, lastUpdated } from '../utils';
import { useLeaderboard } from '../hooks/useLeaderboard';

interface Props {
  order: GitHubOrderBy;
  onOrderChange: (order: GitHubOrderBy) => void;
}

const formatLeaderboardEntry = (key: keyof Row, row: Row): React.ReactNode => {
  if (key === 'username') {
    return (
      <Link href={getGithubProfileURL(row[key])} isExternal>
        {row[key]}
      </Link>
    );
  }

  return <Text fontWeight={'medium'}>{row[key]}</Text>;
};

export const GithubLeaderboard: React.FC<Props> = ({
  order,
  onOrderChange,
}) => {
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    SortDirection.Desc
  );
  const {
    isLoading,
    error,
    leaderboardData: githubData,
  } = useLeaderboard(LeaderboardType.GitHub, order);

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

  const headers: LeaderboardHeader[] = [
    { key: 'rank', label: 'Rank', static: true },
    { key: 'username', label: 'Username', static: true },
    { key: 'totalCommits', label: 'Commits' },
    { key: 'totalPrs', label: 'PRs' },
    { key: 'followers', label: 'Followers' },
  ];

  const getOrderByFromKey = (key: keyof Row): GitHubOrderBy | null => {
    switch (key) {
      case 'totalCommits':
        return GitHubOrderBy.Commits;
      case 'totalPrs':
        return GitHubOrderBy.Prs;
      case 'followers':
        return GitHubOrderBy.Followers;
      default:
        return null;
    }
  };

  const handleSort = (key: keyof Row) => {
    const newOrder = getOrderByFromKey(key);
    if (newOrder) {
      // if active column clicked
      if (newOrder === order) {
        setSortDirection((prev) =>
          prev === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc
        );
      } else {
        // desc by default
        setSortDirection(SortDirection.Desc);
        onOrderChange(newOrder);
      }
    }
  };

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
          value={order}
          onChange={onOrderChange}
          options={githubOptions}
        />
      </Flex>
      <Box>
        <Leaderboard
          data={githubData}
          orderBy={order}
          sortDirection={sortDirection}
          orderColKey={orderColKey(order)}
          headers={headers}
          cellFormatter={formatLeaderboardEntry}
          onSort={handleSort}
        />
      </Box>
    </Box>
  );
};
