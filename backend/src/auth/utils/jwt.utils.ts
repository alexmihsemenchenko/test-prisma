import { sign, Secret, SignOptions } from 'jsonwebtoken';
import { AuthJwtPayload } from '../types/jwt-payload.type';

const JWT_SECRET = process.env.JWT_SECRET as Secret;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export function signJwt(payload: AuthJwtPayload): string {
  return sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as SignOptions);
}
