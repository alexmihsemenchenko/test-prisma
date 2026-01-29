import { sign, Secret, SignOptions } from 'jsonwebtoken';
import { AuthJwtPayload } from '../types/jwt-payload.type';

const accessSecret = process.env.JWT_ACCESS_SECRET as Secret;
const refreshSecret = process.env.JWT_REFRESH_SECRET as Secret;

export function signAccessToken(payload: AuthJwtPayload): string {
  return sign(payload, accessSecret, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  } as SignOptions);
}

export function signRefreshToken(payload: AuthJwtPayload): string {
  return sign(payload, refreshSecret, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  } as SignOptions);
}
