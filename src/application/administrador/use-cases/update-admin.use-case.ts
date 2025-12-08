import {Injectable, BadRequestException} from '@nestjs/common';
import {PrismaService} from 'src/infrastructure/persistence/prisma/prisma.service';
import {admin} from 'src/shared/firebase-admin';

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
      correo?: string;
    }
  ) {
    try {
      // Si se está actualizando el correo, primero obtener el UID del usuario
      if (data.correo) {
        const usuario = await this.prisma.usuario.findUnique({
          where: {id_usuario: id},
          select: {uid: true, correo: true}
        });
        
        if (!usuario) {
          throw new BadRequestException('Usuario no encontrado');
        }

        // Solo actualizar en Firebase si el correo es diferente
        if (usuario.correo !== data.correo) {
          try {
            await admin.auth().updateUser(usuario.uid, {
              email: data.correo
            });
            console.log(`✅ Correo actualizado en Firebase para UID: ${usuario.uid}`);
          } catch (firebaseError: any) {
            console.error('❌ Error al actualizar en Firebase:', firebaseError);
            throw new BadRequestException(
              'Error al actualizar correo en Firebase: ' + firebaseError.message
            );
          }
        }
      }

      // Actualizar en la base de datos
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
          foto_perfil: true,
          id_rol: true
        }
      });
    } catch (error) {
      throw new BadRequestException(
        error?.message || 'Error al actualizar administrador'
      );
    }
  }
}