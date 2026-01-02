import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Проверяем, есть ли пользователь с таким email, чтобы отловить уникальное ограничение заранее
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          message: 'User with this email already exists',
          path: '/users',
          timestamp: new Date().toISOString(),
        },
        HttpStatus.CONFLICT,
      );
    }

    return this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: passwordHash,
        role: dto.role ?? UserRole.USER,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async findById(Id: string) {
    return this.prisma.user.findUnique({
      where: { id: Id },
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    const data: {
      name?: string;
      password?: string;
      role?: UserRole;
    } = {};

    if (dto.name) {
      data.name = dto.name;
    }

    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    if (dto.role) {
      data.role = dto.role;
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
  }
}
