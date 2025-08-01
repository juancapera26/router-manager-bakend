// src/auth/auth.module.ts

import {Module} from '@nestjs/common';
import {AuthController} from 'src/interface/controllers/auth.controller';
import {AssignRoleController} from 'src/interface/controllers/assign-role.controller';
import {RegisterUserUseCase} from 'src/application/auth/use-cases/register-user.use-case';
import {InfrastructureModule} from 'src/infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule],
  controllers: [AuthController, AssignRoleController],
  providers: [RegisterUserUseCase]
})
export class AuthModule {}
