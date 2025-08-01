import {Module} from '@nestjs/common';
import {UsersController} from 'src/interface/controllers/users.controller';
import {CreateUserUseCase} from 'src/application/users/use-cases/create-user.use-case';
import {PrismaService} from 'src/infrastructure/persistence/prisma/prisma.service';
import {PrismaUserRepository} from 'src/infrastructure/persistence/prisma/prisma-user.repository';

@Module({
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    PrismaService,
    {provide: 'UserRepository', useClass: PrismaUserRepository}
  ]
})
export class UsersModule {}
