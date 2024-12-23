import { parseAnyDate } from '../localization';
import api from './api';
import {
  RawLeetCodeStats,
  LeetCodeStats,
  RawGitHubStats,
  GitHubStats,
  LeetCodeOrderBy,
  GitHubOrderBy,
} from '../types';
import { devPrint } from '../components/utils/RandomUtils';

function deserializeLeetCodeStats({
  user: { username },
  total_solved,
  easy_solved,
  medium_solved,
  hard_solved,
  last_updated,
}: RawLeetCodeStats): LeetCodeStats {
  return {
    username,
    totalSolved: total_solved,
    easySolved: easy_solved,
    mediumSolved: medium_solved,
    hardSolved: hard_solved,
    lastUpdated: parseAnyDate(last_updated),
  };
}

function deserializeGitHubStats({
  user: { username },
  total_prs,
  total_commits,
  followers,
  last_updated,
}: RawGitHubStats): GitHubStats {
  return {
    username,
    totalPrs: total_prs,
    totalCommits: total_commits,
    followers,
    lastUpdated: parseAnyDate(last_updated),
  };
}

export function getLeetcodeLeaderboard(
  orderBy: LeetCodeOrderBy = LeetCodeOrderBy.Total
): Promise<LeetCodeStats[]> {
  return api
    .get(`/leaderboard/leetcode/?orderBy=${orderBy}`)
    .then((res) => {
      if (res.status !== 200)
        throw new Error('Failed to get leetcode leaderboard');
      return res.data.map(deserializeLeetCodeStats);
    })
    .catch(devPrint);
}

export function getGitHubLeaderboard(
  orderBy: GitHubOrderBy = GitHubOrderBy.Commits
): Promise<GitHubStats[]> {
  return api
    .get(`/leaderboard/github/?orderBy=${orderBy}`)
    .then((res) => {
      if (res.status !== 200)
        throw new Error('Failed to get github leaderboard');
      return res.data.map(deserializeGitHubStats);
    })
    .catch(devPrint);
}
