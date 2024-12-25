export interface SocialField {
  username: string;
  isPrivate: boolean;
}
export interface Member {
  id: number;
  username: string;
  created: Date;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  discordUsername: string;
  discordId: number;
  preview?: string;
  major?: string;
  gradDate?: Date;
  linkedin?: SocialField;
  github?: SocialField;
  leetcode?: SocialField;
  resumeUrl?: string;
  local?: string;
  bio?: string;
  groups?: { name: string }[];
  profilePictureUrl?: string;
}
export interface RawMemberData {
  id: number;
  username: string;
  created: string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  discord_id: number;
  discord_username: string;
  major?: string;
  preview?: string;
  grad_date?: string;
  linkedin?: SocialField;
  github?: SocialField;
  leetcode?: SocialField;
  resume_url?: string;
  local?: string;
  bio?: string;
  groups?: { name: string }[];
  profile_picture_url?: string;
}

export interface DetailedResponse {
  detail: string;
}

export interface LeaderboardEntry {
  username: string;
  lastUpdated: Date;
}

export interface RawGitHubStats {
  user: {
    username: string;
  };
  total_prs: number;
  total_commits: number;
  followers: number;
  last_updated: string;
}

export interface GitHubStats extends LeaderboardEntry {
  totalPrs: number;
  totalCommits: number;
  followers: number;
}

export interface RawLeetCodeStats {
  user: {
    username: string;
  };
  total_solved: number;
  easy_solved: number;
  medium_solved: number;
  hard_solved: number;
  last_updated: string;
}

export interface LeetCodeStats extends LeaderboardEntry {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
}

export interface RawApplicationStats {
  user: {
    username: string;
  };
  applied: number;
  last_updated: string;
}

export interface ApplicationStats extends LeaderboardEntry {
  applied: number;
}

export enum LeaderboardType {
  LeetCode = 'leetcode',
  GitHub = 'github',
  InternshipApplications = 'internship-applications',
  NewGradApplications = 'new-grad-application',
}

export enum LeetCodeOrderBy {
  Total = 'total',
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
  Completion = 'completion',
}

export enum GitHubOrderBy {
  Commits = 'commits',
  Prs = 'prs',
  Followers = 'followers',
  Recent = 'recent',
}

export enum ApplicationOrderBy {
  Applied = 'applied',
  Recent = 'recent',
}

export interface LeaderboardHeader {
  key: string;
  label: string;
}

export type Ordering = GitHubOrderBy | LeetCodeOrderBy | ApplicationOrderBy;
export type LeaderboardDataHandler = (
  order: Ordering
) => Promise<LeaderboardEntry[]>;
