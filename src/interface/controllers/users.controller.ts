import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/users/use-cases/create-user.use-case';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly createUser: CreateUserUseCase) {}

  @Post()
  async create(@Body() body: CreateUserDto) {
    await this.createUser.execute(body.email, body.role);
    return { message: 'User created' };
  }
}
