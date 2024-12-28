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
import {
  LeaderboardHeader,
  Ordering,
  LeaderboardEntry,
  SortDirection,
  Row,
} from '../types';
import { devPrint } from './utils/RandomUtils';

interface LeaderboardProps {
  data: LeaderboardEntry[];
  orderBy: Ordering;
  sortDirection: SortDirection;
  headers: LeaderboardHeader[];
  orderColKey: string;
  cellFormatter: (key: keyof Row, row: Row) => React.ReactNode;
  onSort?: (key: string) => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  data,
  sortDirection,
  orderColKey,
  headers,
  cellFormatter,
  onSort,
}) => {
  // Sort data based on direction
  const sortedData = React.useMemo(() => {
    const sorted = [...data];
    if (sortDirection === SortDirection.Asc) {
      sorted.reverse();
    }
    return sorted;
  }, [data, sortDirection]);

  // Ranks based on descending order
  const rankMap = React.useMemo(() => {
    const map = new Map();
    data.forEach((item, index) => {
      map.set(item.username, index + 1);
    });
    return map;
  }, [data]);

  if (data.length === 0) {
    return (
      <Flex justifyContent="center">
        <Text fontWeight="semibold" fontSize="larger">
          No data available.
        </Text>
      </Flex>
    );
  }

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
                cursor={header.static ? 'default' : 'pointer'}
                onClick={() => onSort?.(header.key)}
                _hover={{ bg: 'gray.50' }}
              >
                <Flex align="center" gap={2}>
                  {header.label}
                  {header.key === orderColKey && (
                    <Icon
                      as={ChevronUpIcon}
                      color="gray.400"
                      boxSize={5}
                      transform={
                        sortDirection === SortDirection.Asc ? 'rotate(180deg)' : undefined
                      }
                      transition="transform 0.2s"
                    />
                  )}
                </Flex>
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {sortedData.map((row) => (
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
                    { ...row, rank: rankMap.get(row.username) },
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
