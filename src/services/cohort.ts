import { RawCohortData, Cohort } from '../types';
import { deserializeMember } from './member';

export const deserializeCohortData = ({
  members,
  ...rest
}: RawCohortData): Cohort => {
  return {
    members: members.map(deserializeMember),
    ...rest,
  };
};
