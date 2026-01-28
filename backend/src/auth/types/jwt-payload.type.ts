import { UserRole } from '../../generated/prisma';

export type JwtPayload = {
  sub: string;
  role: UserRole;
};
