// application/auth/use-cases/register-user.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import { AuthProvider } from '../../../domain/auth/auth.provider';
// import { UserRepository } from '../../../domain/users/repositories/user.repository';
// import { User } from '../../../domain/users/entities/user.entity';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject('AuthProvider') private readonly authProvider: AuthProvider,
    // @Inject('UserRepository') private readonly userRepo: UserRepository,
  ) {}

  async execute(
    email: string,
    password: string,
    role: string,
  ): Promise<{ uid: string }> {
    const uid = await this.authProvider.createUser(email, password);
    await this.authProvider.setRole(uid, role);

    // const now = new Date();
    // const user = new User(uid, email, role, now, now);
    // await this.userRepo.create(user);

    return { uid };
  }
}
