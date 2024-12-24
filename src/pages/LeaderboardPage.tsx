import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  TabList,
  Tab,
  VStack,
  Flex,
  Spinner,
  Text,
  useToast,
  Container,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  LeaderboardType,
  LeetCodeOrderBy,
  GitHubOrderBy,
  LeetCodeStats,
  GitHubStats,
} from '../types';
import Leaderboard from '../components/Leaderboard';
import {
  getLeetcodeLeaderboard,
  getGitHubLeaderboard,
} from '../services/leaderboard';
import { formatDate } from '../localization';
import { OrderBySelect } from '../components/OrderBySelect';

const LeaderboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LeaderboardType>(
    LeaderboardType.LeetCode
  );
  const [leetcodeOrder, setLeetcodeOrder] = useState<LeetCodeOrderBy>(
    LeetCodeOrderBy.Total
  );
  const [githubOrder, setGithubOrder] = useState<GitHubOrderBy>(
    GitHubOrderBy.Commits
  );
  const [leetcodeData, setLeetcodeData] = useState<LeetCodeStats[]>([]);
  const [githubData, setGithubData] = useState<GitHubStats[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();

  const toast = useToast();
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const leetcodeOptions = [
    { value: LeetCodeOrderBy.Total, label: 'Total Problems' },
    { value: LeetCodeOrderBy.Easy, label: 'Easy Problems' },
    { value: LeetCodeOrderBy.Medium, label: 'Medium Problems' },
    { value: LeetCodeOrderBy.Hard, label: 'Hard Problems' },
  ];

  const githubOptions = [
    { value: GitHubOrderBy.Commits, label: 'Total Commits' },
    { value: GitHubOrderBy.Prs, label: 'Pull Requests' },
    { value: GitHubOrderBy.Followers, label: 'Followers' },
  ];

  const fetchData = async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      if (activeTab === LeaderboardType.LeetCode) {
        const data = await getLeetcodeLeaderboard(leetcodeOrder);
        if (data) {
          setLeetcodeData(data);
        } else {
          throw new Error('Failed to fetch LeetCode leaderboard');
        }
      } else {
        const data = await getGitHubLeaderboard(githubOrder);
        if (data) {
          setGithubData(data);
        } else {
          throw new Error('Failed to fetch GitHub leaderboard');
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, leetcodeOrder, githubOrder]);

  const handleTabChange = (index: number) => {
    setActiveTab(
      index === 0 ? LeaderboardType.LeetCode : LeaderboardType.GitHub
    );
  };

  const lastUpdated = () => {
    const data =
      activeTab === LeaderboardType.LeetCode ? leetcodeData : githubData;
    const lastUpdated = data
      .map((data) => data.lastUpdated)
      .reduce((acc, curr) => (curr > acc ? curr : acc), new Date(0));
    return lastUpdated ? formatDate(lastUpdated, true) : '';
  };

  const renderContent = () => {
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

    return (
      <Box>
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontSize="sm" color="gray.500">
            Last updated: {lastUpdated()}
          </Text>
          <OrderBySelect
            value={
              activeTab === LeaderboardType.LeetCode
                ? leetcodeOrder
                : githubOrder
            }
            onChange={(value) => {
              if (activeTab === LeaderboardType.LeetCode) {
                setLeetcodeOrder(value as LeetCodeOrderBy);
              } else {
                setGithubOrder(value as GitHubOrderBy);
              }
            }}
            options={
              activeTab === LeaderboardType.LeetCode
                ? leetcodeOptions
                : githubOptions
            }
          />
        </Flex>
        <Box>
          <Leaderboard
            data={
              activeTab === LeaderboardType.LeetCode ? leetcodeData : githubData
            }
            type={activeTab}
            orderBy={
              activeTab === LeaderboardType.LeetCode
                ? leetcodeOrder
                : githubOrder
            }
          />
        </Box>
      </Box>
    );
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Tabs onChange={handleTabChange} colorScheme="blue" variant="enclosed">
          <TabList borderBottomWidth="1px" borderBottomColor={borderColor}>
            <Tab>LeetCode</Tab>
            <Tab>GitHub</Tab>
          </TabList>
        </Tabs>
        {renderContent()}
      </VStack>
    </Container>
  );
};

export default LeaderboardPage;
