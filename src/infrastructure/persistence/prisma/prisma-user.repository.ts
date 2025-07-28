import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain/users/repositories/user.repository';
import { User } from '../../../domain/users/entities/user.entity';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user
      ? new User(user.id, user.email, user.role, user.createdAt, user.updatedAt)
      : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user
      ? new User(user.id, user.email, user.role, user.createdAt, user.updatedAt)
      : null;
  }
}
