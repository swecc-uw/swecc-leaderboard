import React, { useState } from 'react';
import {
  Tabs,
  TabList,
  Tab,
  VStack,
  Container,
  useColorModeValue,
} from '@chakra-ui/react';
import { LeaderboardType } from '../types';
import { LeetcodeLeaderboard } from '../components/LeetcodeLeaderboard';
import { GithubLeaderboard } from '../components/GithubLeaderboard';

const LeaderboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LeaderboardType>(
    LeaderboardType.LeetCode
  );
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleTabChange = (index: number) => {
    setActiveTab(
      index === 0 ? LeaderboardType.LeetCode : LeaderboardType.GitHub
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case LeaderboardType.LeetCode:
        return <LeetcodeLeaderboard />;
      case LeaderboardType.GitHub:
        return <GithubLeaderboard />;
    }
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
