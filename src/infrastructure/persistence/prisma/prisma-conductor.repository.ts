import {Injectable} from '@nestjs/common';
import {PrismaService} from './prisma.service';
import {ConductorRepository} from '../../../domain/conductores/repositories/conductor.repository';
import {ConductorEntity} from '../../../domain/conductores/entities/conductor.entity';

@Injectable()
export class PrismaConductorRepository implements ConductorRepository {
  constructor(private readonly prisma: PrismaService) {}

  async update(
    id: number,
    data: Partial<ConductorEntity>
  ): Promise<ConductorEntity> {
    const updatedData: Record<string, any> = {};

    if (data.telefono) updatedData.telefono_movil = data.telefono;

    // Actualizar foto de perfil y fecha de actualización
    if (data.foto_perfil) {
      updatedData.foto_perfil = data.foto_perfil;
      updatedData.fecha_actualizacion_foto = new Date();
    }

    // Puedes agregar otros campos opcionales según tu entity
    // e.g., nombre, apellido, etc.
    const updated = await this.prisma.usuario.update({
      where: {id_usuario: id},
      data: updatedData
    });

    return updated as unknown as ConductorEntity;
  }
}
