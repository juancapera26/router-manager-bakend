import {Injectable} from '@nestjs/common';
import {UserRepository} from '../../../domain/users/repositories/user.repository';
import {Usuario} from '../../../domain/users/entities/user.entity';
import {PrismaService} from './prisma.service';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(usuario: Usuario): Promise<void> {
    await this.prisma.$transaction(async prisma => {
      // 1️⃣ Crear usuario
      const newUser = await prisma.usuario.create({
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

      // 2️⃣ Si es conductor, crear su estado solo si no existe
      if (usuario.id_rol === 2) {
        const existingState = await prisma.estado_conductor.findUnique({
          where: {id_conductor: newUser.id_usuario}
        });

        if (!existingState) {
          await prisma.estado_conductor.create({
            data: {
              id_conductor: newUser.id_usuario,
              estado: 'Disponible'
            }
          });
        }
      }
    });
  }

  async findById(id_usuario: number): Promise<Usuario | null> {
    const usuario = await this.prisma.usuario.findUnique({
      where: {id_usuario},
      include: {estado_conductor: true}
    });

    if (!usuario) return null;

    return new Usuario(
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
    );
  }

  async findByEmail(correo: string): Promise<Usuario | null> {
    const usuario = await this.prisma.usuario.findUnique({
      where: {correo},
      include: {estado_conductor: true}
    });

    if (!usuario) return null;

    return new Usuario(
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
    );
  }
}
