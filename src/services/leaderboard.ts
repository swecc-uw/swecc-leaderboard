import { parseAnyDate } from '../localization';
import api from './api';
import {
  RawLeetCodeStats,
  LeetCodeStats,
  RawGitHubStats,
  GitHubStats,
  LeetCodeOrderBy,
  GitHubOrderBy,
  ApplicationOrderBy,
  ApplicationStats,
  RawApplicationStats,
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

function deserializeApplicationStats({
  user: { username },
  applied,
}: RawApplicationStats): ApplicationStats {
  return { username, applied };
}

export function getLeetcodeLeaderboard(
  orderBy: LeetCodeOrderBy = LeetCodeOrderBy.Total
): Promise<LeetCodeStats[]> {
  return api
    .get(`/leaderboard/leetcode/?order_by=${orderBy}`)
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
    .get(`/leaderboard/github/?order_by=${orderBy}`)
    .then((res) => {
      if (res.status !== 200)
        throw new Error('Failed to get github leaderboard');
      return res.data.map(deserializeGitHubStats);
    })
    .catch(devPrint);
}

export function getInternshipLeaderboard(
  orderBy: ApplicationOrderBy = ApplicationOrderBy.Applied
): Promise<ApplicationStats[]> {
  return api
    .get(`/leaderboard/internship/?order_by=${orderBy}`)
    .then((res) => {
      if (res.status !== 200) {
        throw new Error('Failed to get internship application leaderboard');
      }

      return res.data.map(deserializeApplicationStats);
    })
    .catch(devPrint);
}

export function getNewGradLeaderboard(
  orderBy: ApplicationOrderBy = ApplicationOrderBy.Applied
): Promise<ApplicationStats[]> {
  return api
    .get(`/leaderboard/new-grad/?order_by=${orderBy}`)
    .then((res) => {
      if (res.status !== 200) {
        throw new Error('Failed to get new grad application leaderboard');
      }

      return res.data.map(deserializeApplicationStats);
    })
    .catch(devPrint);
}
