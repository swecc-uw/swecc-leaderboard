import { Flex, Spinner, Text, Box, HStack, Button } from '@chakra-ui/react';
import React, { useState } from 'react';
import {
  CohortStatsOrderBy,
  LeaderboardHeader,
  LeaderboardType,
  Row,
  SortDirection,
} from '../types';
import Leaderboard from './Leaderboard';
import { OrderBySelect } from './OrderBySelect';
import { lastUpdated } from '../utils';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { ATTENDANCE_PAGE_SIZE } from '../services/leaderboard';

interface Props {
  order: CohortStatsOrderBy;
  onOrderChange: (order: CohortStatsOrderBy) => void;
}

const formatLeaderboardEntry = (key: keyof Row, row: Row): React.ReactNode => {
  return <Text fontWeight="medium">{row[key]}</Text>;
};

export const CohortStatsLeaderboard: React.FC<Props> = ({
  order,
  onOrderChange,
}) => {
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    SortDirection.Desc
  );

  const [page, setPage] = useState(1);

  const {
    isLoading,
    error,
    leaderboardData: cohortStatsData,
    count,
  } = useLeaderboard(LeaderboardType.CohortStats, order, page);

  const totalPages = Math.ceil(count! / ATTENDANCE_PAGE_SIZE);

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

  const attendanceOptions = [
    { value: CohortStatsOrderBy.Applications, label: 'Applications' },
    { value: CohortStatsOrderBy.DailyCheck, label: 'Daily Check-ins' },
    { value: CohortStatsOrderBy.Interviews, label: 'Interviews' },
    { value: CohortStatsOrderBy.Offers, label: 'Offers' },
    {
      value: CohortStatsOrderBy.OnlineAssessments,
      label: 'Online Assessments',
    },
  ];

  const headers: LeaderboardHeader[] = [
    { key: 'rank', label: 'Rank', static: true },
    { key: 'username', label: 'Username', static: true },
    { key: 'applications', label: 'Applications', static: false },
    { key: 'dailyCheck', label: 'Daily Check-ins', static: false },
    { key: 'interviews', label: 'Interviews', static: false },
    { key: 'offers', label: 'Offers', static: false },
    { key: 'onlineAssessments', label: 'Online Assessments', static: false },
  ];

  const getOrderByFromKey = (key: keyof Row): CohortStatsOrderBy | null => {
    switch (key) {
      case 'applications':
        return CohortStatsOrderBy.Applications;
      case 'dailyCheck':
        return CohortStatsOrderBy.DailyCheck;
      case 'interviews':
        return CohortStatsOrderBy.Interviews;
      case 'offers':
        return CohortStatsOrderBy.Offers;
      case 'onlineAssessments':
        return CohortStatsOrderBy.OnlineAssessments;
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

  const orderColKey = (order: CohortStatsOrderBy) => {
    switch (order) {
      case CohortStatsOrderBy.Applications:
        return 'applications';
      case CohortStatsOrderBy.DailyCheck:
        return 'dailyCheck';
      case CohortStatsOrderBy.Interviews:
        return 'interviews';
      case CohortStatsOrderBy.Offers:
        return 'offers';
      case CohortStatsOrderBy.OnlineAssessments:
        return 'onlineAssessments';
      default:
        return '';
    }
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="sm" color="gray.500">
          Last updated: {lastUpdated(cohortStatsData)}
        </Text>
        <OrderBySelect
          value={order}
          onChange={onOrderChange}
          options={attendanceOptions}
        />
      </Flex>
      <Box>
        <Leaderboard
          data={cohortStatsData}
          orderBy={order}
          sortDirection={sortDirection}
          orderColKey={orderColKey(order)}
          headers={headers}
          cellFormatter={formatLeaderboardEntry}
          onSort={handleSort}
        />
        <HStack w="100%" justify="center" mt={2}>
          <Button
            isDisabled={page == 1}
            onClick={() => {
              setPage(page - 1);
            }}
          >
            Previous
          </Button>
          <Button
            isDisabled={page == totalPages}
            onClick={() => {
              setPage(page + 1);
            }}
          >
            Next
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};
