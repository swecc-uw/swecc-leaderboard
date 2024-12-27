import { Flex, Spinner, Text, Box, Link } from '@chakra-ui/react';
import React, { useState } from 'react';
import { LeaderboardType, LeetCodeOrderBy, Row, SortDirection } from '../types';
import Leaderboard from './Leaderboard';
import { OrderBySelect } from './OrderBySelect';
import { getLeetcodeProfileURL, lastUpdated } from '../utils';
import { useLeaderboard } from '../hooks/useLeaderboard';

interface Props {
  order: LeetCodeOrderBy;
  onOrderChange: (order: LeetCodeOrderBy) => void;
}

const difficultyColors = {
  easySolved: 'green.500',
  mediumSolved: 'yellow.500',
  hardSolved: 'red.500',
};

const formatLeaderboardEntry = (key: keyof Row, row: Row): React.ReactNode => {
  if (key === 'username') {
    return (
      <Link href={getLeetcodeProfileURL(row[key])} isExternal>
        {row[key]}
      </Link>
    );
  }

  if (['easySolved', 'mediumSolved', 'hardSolved'].includes(key)) {
    return (
      <Text
        color={difficultyColors[key as keyof typeof difficultyColors]}
        fontWeight="medium"
      >
        {row[key]}
      </Text>
    );
  }

  return <Text fontWeight={'medium'}>{row[key]}</Text>;
};

export const LeetcodeLeaderboard: React.FC<Props> = ({
  order,
  onOrderChange,
}) => {
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    SortDirection.Desc
  );
  const {
    isLoading,
    error,
    leaderboardData: leetcodeData,
  } = useLeaderboard(LeaderboardType.LeetCode, order);

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
  const leetcodeOptions = [
    { value: LeetCodeOrderBy.Total, label: 'Total Solved' },
    { value: LeetCodeOrderBy.Easy, label: 'Easy Problems' },
    { value: LeetCodeOrderBy.Medium, label: 'Medium Problems' },
    { value: LeetCodeOrderBy.Hard, label: 'Hard Problems' },
  ];

  const headers = [
    { key: 'rank', label: 'Rank', static: true },
    { key: 'username', label: 'Username', static: true },
    { key: 'totalSolved', label: 'Total' },
    { key: 'easySolved', label: 'Easy' },
    { key: 'mediumSolved', label: 'Medium' },
    { key: 'hardSolved', label: 'Hard' },
  ];

  const orderColKey = (order: LeetCodeOrderBy) => {
    switch (order) {
      case LeetCodeOrderBy.Total:
        return 'totalSolved';
      case LeetCodeOrderBy.Easy:
        return 'easySolved';
      case LeetCodeOrderBy.Medium:
        return 'mediumSolved';
      case LeetCodeOrderBy.Hard:
        return 'hardSolved';
      case LeetCodeOrderBy.Completion:
        return 'totalSolved';
      default:
        return '';
    }
  };

  const getOrderByFromKey = (key: string): LeetCodeOrderBy | undefined => {
    switch (key) {
      case 'totalSolved':
        return LeetCodeOrderBy.Total;
      case 'easySolved':
        return LeetCodeOrderBy.Easy;
      case 'mediumSolved':
        return LeetCodeOrderBy.Medium;
      case 'hardSolved':
        return LeetCodeOrderBy.Hard;
      default:
        return undefined;
    }
  };

  const handleSort = (key: string) => {
    const newOrder = getOrderByFromKey(key);
    if (newOrder) {
      if (newOrder === order) {
        setSortDirection((prev) =>
          prev === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc
        );
      } else {
        setSortDirection(SortDirection.Desc);
        onOrderChange(newOrder);
      }
    }
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="sm" color="gray.500">
          Last updated: {lastUpdated(leetcodeData)}
        </Text>
        <OrderBySelect
          value={order}
          onChange={onOrderChange}
          options={leetcodeOptions}
        />
      </Flex>
      <Box>
        <Leaderboard
          data={leetcodeData}
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
