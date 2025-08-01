import {Injectable} from '@nestjs/common';
import {UserRepository} from '../../../domain/users/repositories/user.repository';
import {Usuario} from '../../../domain/users/entities/user.entity';
import {PrismaService} from './prisma.service';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(usuario: Usuario): Promise<void> {
    await this.prisma.usuario.create({
      data: {
        correo: usuario.correo,
        contrasena: usuario.contrasena,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        telefono_movil: usuario.telefono_movil,
        id_empresa: usuario.id_empresa,
        id_rol: usuario.id_rol,
        tipo_documento: usuario.tipo_documento,
        documento: usuario.documento,
        uid: usuario.uid
      }
    });
  }

  async findById(id_usuario: number): Promise<Usuario | null> {
    const usuario = await this.prisma.usuario.findUnique({where: {id_usuario}});
    return usuario
      ? new Usuario(
          usuario.correo,
          usuario.contrasena,
          usuario.nombre,
          usuario.apellido,
          usuario.telefono_movil,
          usuario.id_empresa,
          usuario.id_rol,
          usuario.tipo_documento,
          usuario.documento,
          usuario.uid
        )
      : null;
  }

  async findByEmail(correo: string): Promise<Usuario | null> {
    const usuario = await this.prisma.usuario.findUnique({where: {correo}});
    return usuario
      ? new Usuario(
          usuario.correo,
          usuario.contrasena,
          usuario.nombre,
          usuario.apellido,
          usuario.telefono_movil,
          usuario.id_empresa,
          usuario.id_rol,
          usuario.tipo_documento,
          usuario.documento,
          usuario.uid
        )
      : null;
  }
}
