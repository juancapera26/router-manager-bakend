import {Injectable} from '@nestjs/common';
import {PrismaService} from './prisma.service';

@Injectable()
export class PrismaRutaRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ Obtener todas las rutas con su información relacionada
  async getAllRutas() {
    return this.prisma.ruta.findMany({
      include: {
        usuario: {
          // conductor
          select: {
            id_usuario: true,
            nombre: true,
            apellido: true,
            correo: true
          }
        },
        vehiculo: true,
        paquete: {
          include: {
            cliente: true,
            barrio: {
              include: {
                localidad: true
              }
            }
          }
        }
      },
      orderBy: {fecha_creacion: 'desc'}
    });
  }
}
