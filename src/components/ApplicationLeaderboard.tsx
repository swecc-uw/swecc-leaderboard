import { Flex, Spinner, Text, Box } from '@chakra-ui/react';
import React from 'react';
import {
  ApplicationOrderBy,
  LeaderboardHeader,
  LeaderboardType,
  Row,
  SortDirection,
} from '../types';
import Leaderboard from './Leaderboard';
import { OrderBySelect } from './OrderBySelect';
import { lastUpdated } from '../utils';
import { useLeaderboard } from '../hooks/useLeaderboard';

interface Props {
  type:
    | LeaderboardType.InternshipApplications
    | LeaderboardType.NewGradApplications;
  order: ApplicationOrderBy;
  onOrderChange: (order: ApplicationOrderBy) => void;
}

const formatLeaderboardEntry = (key: keyof Row, row: Row): React.ReactNode => {
  return <Text fontWeight={'medium'}>{row[key]}</Text>;
};

export const ApplicationLeaderboard: React.FC<Props> = ({
  type,
  order,
  onOrderChange,
}) => {
  const {
    isLoading,
    error,
    leaderboardData: applicationData,
  } = useLeaderboard(type, order);

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

  const applicationOptions = [
    { value: ApplicationOrderBy.Applied, label: 'Total Applied' },
    { value: ApplicationOrderBy.Recent, label: 'Recently Applied' },
  ];

  const headers: LeaderboardHeader[] = [
    { key: 'rank', label: 'Rank', static: true },
    { key: 'username', label: 'Username', static: true },
    { key: 'applied', label: 'Applied' },
  ];

  const orderColKey = (order: ApplicationOrderBy) => {
    switch (order) {
      case ApplicationOrderBy.Recent:
      case ApplicationOrderBy.Applied:
        return 'applied';
      default:
        return '';
    }
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="sm" color="gray.500">
          Last updated: {lastUpdated(applicationData)}
        </Text>
        <OrderBySelect
          value={order}
          onChange={onOrderChange}
          options={applicationOptions}
        />
      </Flex>
      <Box>
        <Leaderboard
          data={applicationData}
          sortDirection={SortDirection.Desc}
          orderBy={order}
          orderColKey={orderColKey(order)}
          headers={headers}
          cellFormatter={formatLeaderboardEntry}
        />
      </Box>
    </Box>
  );
};
