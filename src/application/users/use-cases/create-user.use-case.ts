import {Inject, Injectable} from '@nestjs/common';
import {UserRepository} from '../../../domain/users/repositories/user.repository';
import {Usuario} from '../../../domain/users/entities/user.entity';
import {v4 as uuid} from 'uuid';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepo: UserRepository
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
    documento: string
  ): Promise<void> {
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
      uuid()
    );
    await this.userRepo.create(user);
  }
}
