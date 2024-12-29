import React, { useState } from 'react';
import {
  Tabs,
  TabList,
  Tab,
  VStack,
  Container,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  LeaderboardType,
  LeetCodeOrderBy,
  GitHubOrderBy,
  ApplicationOrderBy,
} from '../types';
import { LeetcodeLeaderboard } from '../components/LeetcodeLeaderboard';
import { GithubLeaderboard } from '../components/GithubLeaderboard';
import { ApplicationLeaderboard } from '../components/ApplicationLeaderboard';

const LeaderboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LeaderboardType>(
    LeaderboardType.LeetCode
  );
  const [leetcodeSortOrder, setLeetcodeSortOrder] = useState<LeetCodeOrderBy>(
    LeetCodeOrderBy.Total
  );
  const [githubSortOrder, setGithubSortOrder] = useState<GitHubOrderBy>(
    GitHubOrderBy.Commits
  );
  const [newGradApplicationSortOrder, setNewGradApplicationSortOrder] =
    useState<ApplicationOrderBy>(ApplicationOrderBy.Applied);
  const [internshipApplicationSortOrder, setInternshipApplicationSortOrder] =
    useState<ApplicationOrderBy>(ApplicationOrderBy.Applied);
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const includedLeaderboards = [
    { type: LeaderboardType.LeetCode, tabLabel: 'LeetCode' },
    { type: LeaderboardType.GitHub, tabLabel: 'GitHub' },
    {
      type: LeaderboardType.InternshipApplications,
      tabLabel: 'Internship Applications',
    },
    {
      type: LeaderboardType.NewGradApplications,
      tabLabel: 'New Grad Applications',
    },
  ];

  const handleTabChange = (index: number) => {
    setActiveTab(includedLeaderboards[index].type);
  };

  const renderContent = () => {
    switch (activeTab) {
      case LeaderboardType.LeetCode:
        return (
          <LeetcodeLeaderboard
            key="leetcode"
            order={leetcodeSortOrder}
            onOrderChange={setLeetcodeSortOrder}
          />
        );
      case LeaderboardType.GitHub:
        return (
          <GithubLeaderboard
            key="github"
            order={githubSortOrder}
            onOrderChange={setGithubSortOrder}
          />
        );
      case LeaderboardType.NewGradApplications:
        return (
          <ApplicationLeaderboard
            key="new-grad"
            type={activeTab}
            order={newGradApplicationSortOrder}
            onOrderChange={setNewGradApplicationSortOrder}
          />
        );
      case LeaderboardType.InternshipApplications:
        return (
          <ApplicationLeaderboard
            key="internship"
            type={activeTab}
            order={internshipApplicationSortOrder}
            onOrderChange={setInternshipApplicationSortOrder}
          />
        );
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Tabs onChange={handleTabChange} colorScheme="blue" variant="enclosed">
          <TabList borderBottomWidth="1px" borderBottomColor={borderColor}>
            {includedLeaderboards.map(({ tabLabel }, key) => {
              return <Tab key={key}>{tabLabel}</Tab>;
            })}
          </TabList>
        </Tabs>
        {renderContent()}
      </VStack>
    </Container>
  );
};

export default LeaderboardPage;
