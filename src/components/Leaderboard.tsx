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
} from '@chakra-ui/react';
import { ChevronUpIcon } from '@chakra-ui/icons';
import { LeaderboardHeader, Ordering, LeaderboardEntry } from '../types';
import { devPrint } from './utils/RandomUtils';
import { Row } from '../types';

interface LeaderboardProps {
  data: LeaderboardEntry[];
  orderBy: Ordering;
  headers: LeaderboardHeader[];
  orderColKey: string;
  cellFormatter: (key: keyof Row, row: Row) => React.ReactNode;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  data,
  orderColKey,
  headers,
  cellFormatter,
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
                    cellFormatter
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
  cellFormatter: (key: keyof Row, row: Row) => React.ReactNode
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

  if (key === 'username') {
    return (
      <Flex align="center" gap={2}>
        {cellFormatter(key, row)}
        {row.rank <= 3 && (
          <Text fontSize="lg">
            {row.rank === 1 ? '👑' : row.rank === 2 ? '🥈' : '🥉'}
          </Text>
        )}
      </Flex>
    );
  }

  return cellFormatter(key, row);
};

export default Leaderboard;
