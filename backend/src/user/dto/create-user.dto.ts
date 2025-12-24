import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../generated/prisma';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  role?: UserRole;
}
