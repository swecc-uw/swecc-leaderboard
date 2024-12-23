import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  Flex,
  Icon,
  Link,
} from "@chakra-ui/react";
import { ChevronUpIcon } from "@chakra-ui/icons";
import {
  GitHubStats,
  LeetCodeStats,
  LeaderboardType,
  GitHubOrderBy,
  LeetCodeOrderBy,
} from "../types";
import { devPrint } from "./utils/RandomUtils";

const difficultyColor = (difficulty: string): string => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "green.500";
    case "medium":
      return "yellow.500";
    case "hard":
      return "red.500";
    default:
      return "gray.500";
  }
};

const headers = (isGitHub: boolean): Header[] => {
  if (isGitHub) {
    return [
      { key: "rank", label: "Rank" },
      { key: "username", label: "Username" },
      { key: "totalCommits", label: "Commits" },
      { key: "totalPrs", label: "PRs" },
      { key: "followers", label: "Followers" },
    ];
  }
  return [
    { key: "rank", label: "Rank" },
    { key: "username", label: "Username" },
    { key: "totalSolved", label: "Total" },
    { key: "easySolved", label: "Easy" },
    { key: "mediumSolved", label: "Medium" },
    { key: "hardSolved", label: "Hard" },
  ];
};

interface LeaderboardProps {
  data: GitHubStats[] | LeetCodeStats[];
  type: LeaderboardType;
  orderBy: GitHubOrderBy | LeetCodeOrderBy;
}

type Header = {
  key: string;
  label: string;
};

type Row = {
  rank: number;
  username: string;
  totalSolved?: number;
  easySolved?: number;
  mediumSolved?: number;
  hardSolved?: number;
  totalCommits?: number;
  totalPrs?: number;
  followers?: number;
};

const Leaderboard: React.FC<LeaderboardProps> = ({ data, type, orderBy }) => {
  const isGitHub = type === LeaderboardType.GitHub;

  const orderColKey = (): string => {
    if (isGitHub) {
      switch (orderBy as GitHubOrderBy) {
        case GitHubOrderBy.Commits:
          return "totalCommits";
        case GitHubOrderBy.Prs:
          return "totalPrs";
        case GitHubOrderBy.Followers:
          return "followers";
        default:
          return "";
      }
    } else {
      switch (orderBy as LeetCodeOrderBy) {
        case LeetCodeOrderBy.Total:
          return "totalSolved";
        case LeetCodeOrderBy.Easy:
          return "easySolved";
        case LeetCodeOrderBy.Medium:
          return "mediumSolved";
        case LeetCodeOrderBy.Hard:
          return "hardSolved";
        case LeetCodeOrderBy.Completion:
          return "totalSolved";
        default:
          return "";
      }
    }
  };

  return (
    <Box borderWidth="1px" borderRadius="xl" overflow="scroll" bg="white">
      <Table variant="simple">
        <Thead bg="white">
          <Tr>
            {headers(isGitHub).map((header) => (
              <Th
                key={header.key}
                py={4}
                borderBottomWidth="1px"
                borderBottomColor="gray.200"
                color="gray.600"
                fontSize="sm"
              >
                <Flex align="center" gap={2}>
                  {header.label}
                  {header.key === orderColKey() && (
                    <Icon as={ChevronUpIcon} color="gray.400" boxSize={5} />
                  )}
                </Flex>
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row, index) => (
            <Tr
              key={row.username}
              _hover={{ bg: "gray.50" }}
              transition="background 0.2s"
            >
              {headers(isGitHub).map((header) => (
                <Td
                  key={`${row.username}-${header.key}`}
                  py={4}
                  borderBottomColor="gray.100"
                >
                  {Cell({ ...row, rank: index + 1 }, header, isGitHub)}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

const Cell = (row: Row, header: Header, isGitHub: boolean): React.ReactNode => {
  if (
    !headers(isGitHub)
      .map((h) => h.key)
      .includes(header.key)
  ) {
    devPrint("Invalid header key:", header.key);
    return null;
  }

  const key = header.key as keyof Row;

  if (key === "rank") {
    return (
      <Text color="gray.700" fontWeight="medium">
        #{row.rank}
      </Text>
    );
  }

  if (["easySolved", "mediumSolved", "hardSolved"].includes(key)) {
    return (
      <Text color={difficultyColor(header.label)} fontWeight="medium">
        {row[key]}
      </Text>
    );
  }

  if (key === "username") {
    return (
      <Flex align="center" gap={2}>
        <Link
          href={`
          ${isGitHub ? "https://github.com" : "https://leetcode.com"}/${
            row.username
          }
        `}
          isExternal
        >
          {row[key]}
        </Link>
        {row.rank <= 3 && (
          <Text fontSize="lg">
            {row.rank === 1 ? "👑" : row.rank === 2 ? "🥈" : "🥉"}
          </Text>
        )}
      </Flex>
    );
  }

  return <Text fontWeight="medium">{row[key]}</Text>;
};

export default Leaderboard;
