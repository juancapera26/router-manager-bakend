import {Body, Controller, Post} from '@nestjs/common';
import {CreateUserUseCase} from '../../application/users/use-cases/create-user.use-case';
import {CreateUserDto} from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly createUser: CreateUserUseCase) {}

  @Post()
  async create(@Body() body: CreateUserDto) {
    await this.createUser.execute(
      body.correo,
      body.contrasena,
      body.nombre,
      body.apellido,
      body.telefono_movil,
      body.id_empresa,
      body.id_rol,
      body.tipo_documento,
      body.documento
    );
    return {message: 'User created'};
  }
}
