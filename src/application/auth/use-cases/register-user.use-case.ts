// application/auth/use-cases/register-user.use-case.ts
import {Inject, Injectable} from '@nestjs/common';
import {AuthProvider} from '../../../domain/auth/auth.provider';
import {UserRepository} from '../../../domain/users/repositories/user.repository';
import {Usuario} from '../../../domain/users/entities/user.entity';
import {USER_REPOSITORY} from 'src/domain/users/tokens/user-repository.token';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject('AuthProvider') private readonly authProvider: AuthProvider,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository
  ) {}

  async execute(
    correo: string,
    contrasena: string,
    nombre: string,
    apellido: string,
    telefono_movil: string,
    id_empresa: number,
    id_rol: number,
    tipo_documento: string,
    documento: string,
    uid: string
  ): Promise<{uid: string}> {
    const user = new Usuario(
      correo,
      contrasena,
      nombre,
      apellido,
      telefono_movil,
      id_empresa,
      id_rol,
      tipo_documento,
      documento,
      uid
    );
    await this.userRepository.create(user);

    return {uid};
  }
}
