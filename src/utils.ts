import { GitHubStats, LeetCodeStats } from './types';
import { formatDate } from './localization';

export const lastUpdated = (data: LeetCodeStats[] | GitHubStats[]) => {
  const lastUpdated = data
    .map((data) => data.lastUpdated)
    .reduce((acc, curr) => (curr > acc ? curr : acc), new Date(0));
  return lastUpdated ? formatDate(lastUpdated, true) : '';
};
