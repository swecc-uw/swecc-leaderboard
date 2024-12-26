import { Flex, Spinner, Text, Box } from '@chakra-ui/react';
import React from 'react';
import { ApplicationOrderBy, LeaderboardType, Row } from '../types';
import Leaderboard from './Leaderboard';
import { OrderBySelect } from './OrderBySelect';
import { useState } from 'react';
import { lastUpdated } from '../utils';
import { useLeaderboard } from '../hooks/useLeaderboard';

const formatLeaderboardEntry = (key: keyof Row, row: Row): React.ReactNode => {
  return <Text fontWeight={'medium'}>{row[key]}</Text>;
};

interface Props {
  type:
    | LeaderboardType.InternshipApplications
    | LeaderboardType.NewGradApplications;
}

export const ApplicationLeaderboard: React.FC<Props> = ({ type }) => {
  const [applicationOrder, setApplicationOrder] = useState<ApplicationOrderBy>(
    ApplicationOrderBy.Applied
  );

  const {
    isLoading,
    error,
    leaderboardData: applicationData,
  } = useLeaderboard(type, applicationOrder);

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

  const headers = [
    { key: 'rank', label: 'Rank' },
    { key: 'username', label: 'Username' },
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
          value={applicationOrder}
          onChange={(value) => {
            setApplicationOrder(value as ApplicationOrderBy);
          }}
          options={applicationOptions}
        />
      </Flex>
      <Box>
        <Leaderboard
          data={applicationData}
          orderBy={applicationOrder}
          orderColKey={orderColKey(applicationOrder)}
          headers={headers}
          cellFormatter={formatLeaderboardEntry}
        />
      </Box>
    </Box>
  );
};