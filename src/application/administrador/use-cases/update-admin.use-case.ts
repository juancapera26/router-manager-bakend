/* src/application/users/use-cases/update-admin.use-case.ts */
import {Injectable} from '@nestjs/common';
import {PrismaService} from 'src/infrastructure/persistence/prisma/prisma.service';

@Injectable()
export class UpdateAdminUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: number, data: {foto_perfil?: string}) {
    // Actualiza el administrador por id
    return this.prisma.usuario.update({
      where: {id_usuario: id},
      data: data,
      select: {
        id_usuario: true,
        nombre: true,
        apellido: true,
        correo: true,
        foto_perfil: true
      }
    });
  }
}
