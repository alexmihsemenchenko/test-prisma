import { UserRole } from '../../generated/prisma';

export type AuthJwtPayload = {
  sub: string;
  role: UserRole;
};
