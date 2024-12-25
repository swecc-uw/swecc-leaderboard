import React from 'react';
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
} from '@chakra-ui/react';
import { ChevronUpIcon } from '@chakra-ui/icons';
import {
  GitHubStats,
  LeetCodeStats,
  GitHubOrderBy,
  LeetCodeOrderBy,
  LeaderboardHeader,
  ApplicationStats,
  AllLeaderboardData,
  AllOrderings,
} from '../types';
import { devPrint } from './utils/RandomUtils';

const difficultyColor = (difficulty: string): string => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'green.500';
    case 'medium':
      return 'yellow.500';
    case 'hard':
      return 'red.500';
    default:
      return 'gray.500';
  }
};

interface LeaderboardProps {
  data: AllLeaderboardData;
  orderBy: AllOrderings;
  headers: LeaderboardHeader[];
  orderColKey: string;
  externalLinkConstruct: (username: string) => string;
}

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

const Leaderboard: React.FC<LeaderboardProps> = ({
  data,
  orderColKey,
  headers,
  externalLinkConstruct,
}) => {
  return (
    <Box borderWidth="1px" borderRadius="xl" overflow="scroll" bg="white">
      <Table variant="simple">
        <Thead bg="white">
          <Tr>
            {headers.map((header) => (
              <Th
                key={header.key}
                py={4}
                borderBottomWidth="1px"
                borderBottomColor="gray.200"
                color="gray.600"
                fontSize="xs"
              >
                <Flex align="center" gap={2}>
                  {header.label}
                  {header.key === orderColKey && (
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
              _hover={{ bg: 'gray.50' }}
              transition="background 0.2s"
            >
              {headers.map((header) => (
                <Td
                  key={`${row.username}-${header.key}`}
                  py={4}
                  borderBottomColor="gray.100"
                  fontSize={header.key === 'username' ? 'sm' : 'xs'}
                >
                  {Cell(
                    { ...row, rank: index + 1 },
                    headers,
                    header,
                    externalLinkConstruct
                  )}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

const Cell = (
  row: Row,
  headers: LeaderboardHeader[],
  header: LeaderboardHeader,
  externalLinkConstruct: (username: string) => string
): React.ReactNode => {
  if (!headers.map((h) => h.key).includes(header.key)) {
    devPrint('Invalid header key:', header.key);
    return null;
  }

  const key = header.key as keyof Row;

  if (key === 'rank') {
    return (
      <Text color="gray.700" fontWeight="medium">
        #{row.rank}
      </Text>
    );
  }

  if (['easySolved', 'mediumSolved', 'hardSolved'].includes(key)) {
    return (
      <Text color={difficultyColor(header.label)} fontWeight="medium">
        {row[key]}
      </Text>
    );
  }

  if (key === 'username') {
    return (
      <Flex align="center" gap={2}>
        <Link href={externalLinkConstruct(row[key])} isExternal>
          {row[key]}
        </Link>
        {row.rank <= 3 && (
          <Text fontSize="lg">
            {row.rank === 1 ? '👑' : row.rank === 2 ? '🥈' : '🥉'}
          </Text>
        )}
      </Flex>
    );
  }

  return <Text fontWeight="medium">{row[key]}</Text>;
};

export default Leaderboard;
