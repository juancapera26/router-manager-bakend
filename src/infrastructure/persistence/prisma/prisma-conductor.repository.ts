import {Injectable} from '@nestjs/common';
import {PrismaService} from './prisma.service';
import {ConductorRepository} from '../../../domain/conductores/repositories/conductor.repository';
import {ConductorEntity} from '../../../domain/conductores/entities/conductor.entity';

@Injectable()
export class PrismaConductorRepository implements ConductorRepository {
  constructor(private readonly prisma: PrismaService) {}

  // 🔹 Obtener todos los conductores (incluye empresa)
  async findAll(): Promise<ConductorEntity[]> {
    const usuarios = await this.prisma.usuario.findMany({
      where: {id_rol: 2},
      include: {empresa: true} // 👈 solo aquí incluimos empresa
    });

    return usuarios.map(u => ({
      id: u.id_usuario.toString(),
      userId: u.id_usuario.toString(),
      nombre: u.nombre ?? '',
      apellido: u.apellido ?? '',
      correo: u.correo ?? '',
      telefono: u.telefono_movil ?? '',
      foto_perfil: u.foto_perfil ?? null,
      empresa: u.empresa
        ? {
            id_empresa: u.empresa.id_empresa,
            nombre_empresa: u.empresa.nombre_empresa,
            nit: u.empresa.nit,
            telefono_empresa: u.empresa.telefono_empresa
          }
        : null,
      uid: u.uid
    }));
  }

  // 🔹 Buscar un conductor por ID (incluye empresa)
  async findById(id: number): Promise<ConductorEntity | null> {
    const u = await this.prisma.usuario.findUnique({
      where: {id_usuario: id},
      include: {empresa: true} // 👈 incluir empresa solo al leer
    });

    if (!u) return null;

    return {
      id: u.id_usuario.toString(),
      userId: u.id_usuario.toString(),
      nombre: u.nombre ?? '',
      apellido: u.apellido ?? '',
      correo: u.correo ?? '',
      telefono: u.telefono_movil ?? '',
      foto_perfil: u.foto_perfil ?? null,
      empresa: u.empresa
        ? {
            id_empresa: u.empresa.id_empresa,
            nombre_empresa: u.empresa.nombre_empresa,
            nit: u.empresa.nit,
            telefono_empresa: u.empresa.telefono_empresa
          }
        : null,
      uid: u.uid
    };
  }

  // 🔹 Crear conductor (no incluye empresa en el retorno)
  async create(data: Partial<ConductorEntity>): Promise<ConductorEntity> {
    const newUser = await this.prisma.usuario.create({
      data: {
        nombre: data.nombre ?? 'N/A',
        apellido: data.apellido ?? 'N/A',
        correo: data.correo ?? 'demo@example.com',
        contrasena: '123456',
        id_empresa: 1, // ⚠️ o pásalo por parámetro si quieres que sea dinámico
        id_rol: 2,
        telefono_movil: data.telefono,
        foto_perfil: data.foto_perfil,
        uid: Math.random().toString(36).substring(2)
      }
    });

    return {
      id: newUser.id_usuario.toString(),
      userId: newUser.id_usuario.toString(),
      nombre: newUser.nombre ?? '',
      apellido: newUser.apellido ?? '',
      correo: newUser.correo ?? '',
      telefono: newUser.telefono_movil ?? '',
      foto_perfil: newUser.foto_perfil ?? null,
      uid: newUser.uid
    };
  }

  // 🔹 Actualizar conductor (no incluye empresa en el retorno)
  async update(
    id: number,
    data: Partial<ConductorEntity>
  ): Promise<ConductorEntity> {
    const updateData: any = {};
    if (data.nombre) updateData.nombre = data.nombre;
    if (data.apellido) updateData.apellido = data.apellido;
    if (data.correo) updateData.correo = data.correo;
    if (data.telefono) updateData.telefono_movil = data.telefono;
    if (data.foto_perfil) {
      updateData.foto_perfil = data.foto_perfil;
      updateData.fecha_actualizacion_foto = new Date();
    }

    const updated = await this.prisma.usuario.update({
      where: {id_usuario: id},
      data: updateData
    });

    return {
      id: updated.id_usuario.toString(),
      userId: updated.id_usuario.toString(),
      nombre: updated.nombre ?? '',
      apellido: updated.apellido ?? '',
      correo: updated.correo ?? '',
      telefono: updated.telefono_movil ?? '',
      foto_perfil: updated.foto_perfil ?? null,
      uid: updated.uid
    };
  }

  // 🔹 Eliminar conductor
  async delete(id: number): Promise<void> {
    await this.prisma.usuario.delete({where: {id_usuario: id}});
  }
}
