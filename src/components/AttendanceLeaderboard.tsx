import { Flex, Spinner, Text, Box } from '@chakra-ui/react';
import React, { useState } from 'react';
import {
  EngagementOrderBy,
  LeaderboardHeader,
  LeaderboardType,
  Row,
  SortDirection,
} from '../types';
import Leaderboard from './Leaderboard';
import { OrderBySelect } from './OrderBySelect';
import { lastUpdated } from '../utils';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { devPrint } from './utils/RandomUtils';

interface Props {
  order: EngagementOrderBy;
  onOrderChange: (order: EngagementOrderBy) => void;
}

const formatLeaderboardEntry = (key: keyof Row, row: Row): React.ReactNode => {
  devPrint(row);
  return <Text fontWeight={'medium'}>{row[key]}</Text>;
};

export const AttendanceLeaderboard: React.FC<Props> = ({
  order,
  onOrderChange,
}) => {
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    SortDirection.Desc
  );
  const {
    isLoading,
    error,
    leaderboardData: attendanceData,
  } = useLeaderboard(LeaderboardType.Attendance, order);

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
    { value: EngagementOrderBy.Attendance, label: 'Attendance' },
  ];

  const headers: LeaderboardHeader[] = [
    { key: 'rank', label: 'Rank', static: true },
    { key: 'username', label: 'Username', static: true },
    { key: 'sessionsAttended', label: 'Sessions Attended', static: false },
  ];

  const getOrderByFromKey = (key: keyof Row): EngagementOrderBy | null => {
    switch (key) {
      case 'sessionsAttended':
        return EngagementOrderBy.Attendance;
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

  const orderColKey = (order: EngagementOrderBy) => {
    switch (order) {
      case EngagementOrderBy.Attendance:
        return 'sessionsAttended';
      default:
        return '';
    }
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="sm" color="gray.500">
          Last updated: {lastUpdated(attendanceData)}
        </Text>
        <OrderBySelect
          value={order}
          onChange={onOrderChange}
          options={attendanceOptions}
        />
      </Flex>
      <Box>
        <Leaderboard
          data={attendanceData}
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