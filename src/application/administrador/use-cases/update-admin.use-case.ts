import {Injectable, BadRequestException} from '@nestjs/common';
import {PrismaService} from 'src/infrastructure/persistence/prisma/prisma.service';

@Injectable()
export class UpdateAdminUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    id: number,
    data: {
      nombre?: string;
      apellido?: string;
      telefono_movil?: string;
      tipo_documento?: string;
      documento?: string;
      id_empresa?: number;
      foto_perfil?: string;
    }
  ) {
    try {
      return await this.prisma.usuario.update({
        where: {id_usuario: id},
        data: data,
        select: {
          id_usuario: true,
          nombre: true,
          apellido: true,
          correo: true,
          telefono_movil: true,
          tipo_documento: true,
          documento: true,
          id_empresa: true,
          foto_perfil: true
        }
      });
    } catch (error) {
      throw new BadRequestException(
        error?.message || 'Error al actualizar administrador'
      );
    }
  }
}
