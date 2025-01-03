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
  LeaderboardDataHandler,
  LeaderboardType,
  RawAttendanceStats,
  AttendanceStats,
  EngagementOrderBy,
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
  last_updated,
}: RawApplicationStats): ApplicationStats {
  return { username, applied, lastUpdated: parseAnyDate(last_updated) };
}

function deserializeAttendanceStats({
  member: { username },
  sessions_attended,
}: RawAttendanceStats): AttendanceStats {
  // Store last updated as current time for now, change when `last_updated` is added to backend
  return {
    username,
    sessionsAttended: sessions_attended,
    lastUpdated: parseAnyDate(new Date()),
  };
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
    .get(`/leaderboard/newgrad/?order_by=${orderBy}`)
    .then((res) => {
      if (res.status !== 200) {
        throw new Error('Failed to get new grad application leaderboard');
      }

      return res.data.map(deserializeApplicationStats);
    })
    .catch(devPrint);
}

export function getAttendanceLeaderboard(
  orderBy: EngagementOrderBy = EngagementOrderBy.Attendance
): Promise<ApplicationStats[]> {
  return api
    .get(`/leaderboard/attendance/?order_by=${orderBy}`)
    .then((res) => {
      if (res.status !== 200) {
        throw new Error('Failed to get attendance leaderboard');
      }

      return res.data.map(deserializeAttendanceStats);
    })
    .catch(devPrint);
}

export const getLeaderboardDataHandlerFromType = (
  type: LeaderboardType
): LeaderboardDataHandler => {
  switch (type) {
    case LeaderboardType.LeetCode:
      return getLeetcodeLeaderboard as LeaderboardDataHandler;
    case LeaderboardType.GitHub:
      return getGitHubLeaderboard as LeaderboardDataHandler;
    case LeaderboardType.InternshipApplications:
      return getInternshipLeaderboard as LeaderboardDataHandler;
    case LeaderboardType.NewGradApplications:
      return getNewGradLeaderboard as LeaderboardDataHandler;
    case LeaderboardType.Attendance:
      return getAttendanceLeaderboard as LeaderboardDataHandler;
    default:
      throw new Error('Invalid leaderboard type was provided');
  }
};
