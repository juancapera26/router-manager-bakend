import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain/users/repositories/user.repository';
import { User } from '../../../domain/users/entities/user.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepo: UserRepository,
  ) {}

  async execute(email: string, role: string): Promise<void> {
    const user = new User(uuid(), email, role, new Date(), new Date());
    await this.userRepo.create(user);
  }
}
