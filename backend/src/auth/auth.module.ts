import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule, // Auth зависит от User, а не от Prisma напрямую
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
