import {
  AllLeaderboardData,
  AllOrderings,
  ApplicationOrderBy,
  GitHubOrderBy,
  LeaderboardType,
  LeetCodeOrderBy,
} from './types';
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

export const assertTypeAndOrderingIntegrity = (
  type: LeaderboardType,
  orderBy: AllOrderings
) => {
  switch (type) {
    case LeaderboardType.GitHub:
      return Object.values(GitHubOrderBy).includes(orderBy as GitHubOrderBy);
    case LeaderboardType.LeetCode:
      return Object.values(LeetCodeOrderBy).includes(
        orderBy as LeetCodeOrderBy
      );
    case LeaderboardType.InternshipApplications:
    case LeaderboardType.NewGradApplications:
      return Object.values(ApplicationOrderBy).includes(
        orderBy as ApplicationOrderBy
      );
    default:
      return false;
  }
};
