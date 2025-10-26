import {Injectable} from '@nestjs/common';
import {PrismaService} from './prisma.service';
import {ConductorRepository} from '../../../domain/conductores/repositories/conductor.repository';
import {ConductorEntity} from '../../../domain/conductores/entities/conductor.entity';

@Injectable()
export class PrismaConductorRepository implements ConductorRepository {
  constructor(private readonly prisma: PrismaService) {}

  // 🔹 Obtener todos los conductores (incluye empresa y estado_conductor)
  async findAll(): Promise<ConductorEntity[]> {
    const usuarios = await this.prisma.usuario.findMany({
      where: {id_rol: 2}, // 2 = rol conductor
      include: {
        empresa: true,
        estado_conductor: true // ✅ ya es válido tras ajustar el schema
      }
    });

    return usuarios.map(u => ({
      id: u.id_usuario.toString(),
      userId: u.id_usuario.toString(),
      nombre: u.nombre ?? '',
      apellido: u.apellido ?? '',
      correo: u.correo ?? '',
      telefono: u.telefono_movil ?? '',
      foto_perfil: u.foto_perfil ?? null,
      estado: u.estado_conductor?.estado ?? 'Sin estado', // ✅ tipo seguro
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

  // 🔹 Buscar un conductor por ID (incluye empresa y estado)
  async findById(id: number): Promise<ConductorEntity | null> {
    const u = await this.prisma.usuario.findUnique({
      where: {id_usuario: id},
      include: {
        empresa: true,
        estado_conductor: true // ✅ incluir también estado aquí
      }
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
      estado: u.estado_conductor?.estado ?? 'Sin estado',
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

  // 🔹 Crear conductor (crea usuario y su estado_conductor asociado)
  async create(data: Partial<ConductorEntity>): Promise<ConductorEntity> {
    const newUser = await this.prisma.usuario.create({
      data: {
        nombre: data.nombre ?? 'N/A',
        apellido: data.apellido ?? 'N/A',
        correo: data.correo ?? 'demo@example.com',
        contrasena: '123456',
        id_empresa: 1, // ⚙️ por defecto o pásalo como parámetro
        id_rol: 2,
        telefono_movil: data.telefono,
        foto_perfil: data.foto_perfil,
        uid: Math.random().toString(36).substring(2),
        // ✅ crear estado_conductor automáticamente
        estado_conductor: {
          create: {estado: 'Disponible'}
        }
      },
      include: {
        empresa: true,
        estado_conductor: true
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
      estado: newUser.estado_conductor?.estado ?? 'Sin estado',
      empresa: newUser.empresa
        ? {
            id_empresa: newUser.empresa.id_empresa,
            nombre_empresa: newUser.empresa.nombre_empresa,
            nit: newUser.empresa.nit,
            telefono_empresa: newUser.empresa.telefono_empresa
          }
        : null,
      uid: newUser.uid
    };
  }

  // 🔹 Actualizar conductor (nombre, correo, teléfono o foto)
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
      data: updateData,
      include: {
        empresa: true,
        estado_conductor: true // ✅ para devolver estado actualizado
      }
    });

    return {
      id: updated.id_usuario.toString(),
      userId: updated.id_usuario.toString(),
      nombre: updated.nombre ?? '',
      apellido: updated.apellido ?? '',
      correo: updated.correo ?? '',
      telefono: updated.telefono_movil ?? '',
      foto_perfil: updated.foto_perfil ?? null,
      estado: updated.estado_conductor?.estado ?? 'Sin estado',
      empresa: updated.empresa
        ? {
            id_empresa: updated.empresa.id_empresa,
            nombre_empresa: updated.empresa.nombre_empresa,
            nit: updated.empresa.nit,
            telefono_empresa: updated.empresa.telefono_empresa
          }
        : null,
      uid: updated.uid
    };
  }

  // 🔹 Eliminar conductor
  async delete(id: number): Promise<void> {
    await this.prisma.usuario.delete({where: {id_usuario: id}});
  }
}
