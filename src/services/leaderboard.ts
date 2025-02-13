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
  RawPaginatedAttendanceResponse,
  PaginatedAttendanceResponse,
  PaginatedLeaderboardResponse,
  CohortStatsOrderBy,
  RawPaginatedCohortStatsResponse,
  PaginatedCohortStatsResponse,
  RawCohortStats,
  CohortStats,
} from '../types';
import { devPrint } from '../components/utils/RandomUtils';
import { deserializeCohortData } from './cohort';

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
  last_updated,
  ...rest
}: RawAttendanceStats): AttendanceStats {
  return {
    username,
    sessionsAttended: sessions_attended,
    lastUpdated: parseAnyDate(last_updated),
    ...rest,
  };
}

function deserializePaginatedAttendanceResponse({
  results,
  ...rest
}: RawPaginatedAttendanceResponse): PaginatedAttendanceResponse {
  return {
    data: results.map(deserializeAttendanceStats),
    ...rest,
  };
}

function deserializeCohortStats({
  member: { username },
  daily_checks,
  online_assessments,
  cohort,
  ...rest
}: RawCohortStats): CohortStats {
  return {
    username,
    dailyCheck: daily_checks,
    onlineAssessments: online_assessments,
    lastUpdated: new Date(),
    cohortName: deserializeCohortData(cohort).name,
    ...rest,
  };
}

function deserializePaginatedCohortStatsResponse({
  results,
  ...rest
}: RawPaginatedCohortStatsResponse): PaginatedCohortStatsResponse {
  return {
    data: results.map(deserializeCohortStats),
    ...rest,
  };
}

export function getLeetcodeLeaderboard(
  orderBy: LeetCodeOrderBy = LeetCodeOrderBy.Total
): Promise<void | PaginatedLeaderboardResponse> {
  return api
    .get(`/leaderboard/leetcode/?order_by=${orderBy}`)
    .then((res) => {
      if (res.status !== 200)
        throw new Error('Failed to get leetcode leaderboard');
      return {
        next: null,
        previous: null,
        data: res.data.results.map(deserializeLeetCodeStats),
      };
    })
    .catch(devPrint);
}

export function getGitHubLeaderboard(
  orderBy: GitHubOrderBy = GitHubOrderBy.Commits
): Promise<void | PaginatedLeaderboardResponse> {
  return api
    .get(`/leaderboard/github/?order_by=${orderBy}`)
    .then((res) => {
      if (res.status !== 200)
        throw new Error('Failed to get github leaderboard');
      return {
        next: null,
        previous: null,
        data: res.data.results.map(deserializeGitHubStats),
      };
    })
    .catch(devPrint);
}

export function getInternshipLeaderboard(
  orderBy: ApplicationOrderBy = ApplicationOrderBy.Applied
): Promise<void | PaginatedLeaderboardResponse> {
  return api
    .get(`/leaderboard/internship/?order_by=${orderBy}`)
    .then((res) => {
      if (res.status !== 200) {
        throw new Error('Failed to get internship application leaderboard');
      }

      return {
        next: null,
        previous: null,
        data: res.data.map(deserializeApplicationStats),
      };
    })
    .catch(devPrint);
}

export function getNewGradLeaderboard(
  orderBy: ApplicationOrderBy = ApplicationOrderBy.Applied
): Promise<void | PaginatedLeaderboardResponse> {
  return api
    .get(`/leaderboard/newgrad/?order_by=${orderBy}`)
    .then((res) => {
      if (res.status !== 200) {
        throw new Error('Failed to get new grad application leaderboard');
      }

      return {
        data: res.data.map(deserializeApplicationStats),
        next: null,
        previous: null,
      };
    })
    .catch(devPrint);
}

export const ATTENDANCE_PAGE_SIZE = 50;

export function getAttendanceLeaderboard(
  orderBy: EngagementOrderBy = EngagementOrderBy.Attendance,
  page: number = 1,
  pageSize: number = ATTENDANCE_PAGE_SIZE
): Promise<void | PaginatedLeaderboardResponse> {
  return api
    .get(
      `/leaderboard/attendance/?order_by=${orderBy}&page=${page}&page_size=${pageSize}`
    )
    .then((res) => {
      if (res.status !== 200) {
        throw new Error('Failed to get attendance leaderboard');
      }

      const deserializedResponse = deserializePaginatedAttendanceResponse(
        res.data
      );

      return deserializedResponse;
    })
    .catch(devPrint);
}

export const COHORT_PAGE_SIZE = 50;

export function getCohortStatsLeaderboard(
  orderBy: CohortStatsOrderBy = CohortStatsOrderBy.DailyCheck,
  page: number = 1,
  pageSize: number = COHORT_PAGE_SIZE
) {
  return api
    .get(
      `/leaderboard/cohorts/?order_by=${orderBy}&page=${page}&page_size=${pageSize}`
    )
    .then((res) => {
      if (res.status !== 200) {
        throw new Error('Failed to get cohort stats leaderboard');
      }

      const deserializedResponse = deserializePaginatedCohortStatsResponse(
        res.data
      );

      return deserializedResponse;
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
    case LeaderboardType.CohortStats:
      return getCohortStatsLeaderboard as LeaderboardDataHandler;
    default:
      throw new Error('Invalid leaderboard type was provided');
  }
};
