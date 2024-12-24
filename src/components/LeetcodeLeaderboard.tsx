import { Flex, Spinner, Text, Box, useToast } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { LeetCodeOrderBy, LeetCodeStats } from '../types';
import Leaderboard from './Leaderboard';
import { OrderBySelect } from './OrderBySelect';
import { useState } from 'react';
import { getLeetcodeLeaderboard } from '../services/leaderboard';
import { getLeetcodeProfileURL, lastUpdated } from '../utils';

export const LeetcodeLeaderboard: React.FC = () => {
  const [leetcodeOrder, setLeetcodeOrder] = useState<LeetCodeOrderBy>(
    LeetCodeOrderBy.Total
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();
  const [leetcodeData, setLeetcodeData] = useState<LeetCodeStats[]>([]);

  const toast = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    setError(undefined);

    const data = await getLeetcodeLeaderboard();

    // Success
    if (data) {
      setLeetcodeData(data);
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
  }, [leetcodeOrder]);

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
    { value: LeetCodeOrderBy.Total, label: 'Total Problems' },
    { value: LeetCodeOrderBy.Easy, label: 'Easy Problems' },
    { value: LeetCodeOrderBy.Medium, label: 'Medium Problems' },
    { value: LeetCodeOrderBy.Hard, label: 'Hard Problems' },
  ];

  const headers = [
    { key: 'rank', label: 'Rank' },
    { key: 'username', label: 'Username' },
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

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="sm" color="gray.500">
          Last updated: {lastUpdated(leetcodeData)}
        </Text>
        <OrderBySelect
          value={leetcodeOrder}
          onChange={(value) => {
            setLeetcodeOrder(value as LeetCodeOrderBy);
          }}
          options={leetcodeOptions}
        />
      </Flex>
      <Box>
        <Leaderboard
          data={leetcodeData}
          orderBy={leetcodeOrder}
          orderColKey={orderColKey(leetcodeOrder)}
          headers={headers}
          externalLinkConstruct={getLeetcodeProfileURL}
        />
      </Box>
    </Box>
  );
};
