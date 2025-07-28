import { Module } from '@nestjs/common';
import { UsersController } from 'src/interface/controllers/users.controller';
import { CreateUserUseCase } from 'src/application/users/use-cases/create-user.use-case';
// import { PrismaUserRepository } from 'src/infrastructure/user/prisma-user.repository';
// import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';

@Module({
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    // PrismaService,
    // { provide: 'UserRepository', useClass: PrismaUserRepository },
  ],
})
export class UsersModule {}
