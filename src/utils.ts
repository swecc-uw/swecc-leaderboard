import { AllLeaderboardData } from './types';
import { formatDate } from './localization';

export const lastUpdated = (data: AllLeaderboardData) => {
  const lastUpdated = data
    .map((data) => data.lastUpdated)
    .reduce((acc, curr) => (curr > acc ? curr : acc), new Date(0));
  return lastUpdated ? formatDate(lastUpdated, true) : '';
};

export const getLeetcodeProfileURL = (username: string): string => {
  return `https://leetcode.com/u/${username}`;
};

export const getGithubProfileURL = (username: string): string => {
  return `https://github.com/${username}`;
};
