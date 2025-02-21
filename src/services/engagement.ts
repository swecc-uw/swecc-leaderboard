import { devPrint } from '../components/utils/RandomUtils';
import { UserStats } from '../types';
import api from './api';

export function getUserStats(memberId?: number): Promise<UserStats> {
  const baseUrl = '/engagement/user/';

  return api
    .get<UserStats>(memberId ? baseUrl + memberId : baseUrl)
    .then((response) => response.data)
    .catch((error) => {
      devPrint('Failed to fetch user stats:', error);
      throw error;
    });
}
