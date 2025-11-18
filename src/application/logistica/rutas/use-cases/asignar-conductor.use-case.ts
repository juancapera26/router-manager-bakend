// src/application/logistica/rutas/use-cases/asignar-conductor.use-case.ts

import { Injectable, Inject, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { CambiarEstadoConductorUseCase } from 'src/application/conductores/use-cases/cambiar-estado-conductor.use-case';
import { RutaRepository } from 'src/domain/logistica/rutas/repositories/ruta.repository';
import { RUTA_REPOSITORY_TOKEN } from 'src/domain/logistica/rutas/tokens/ruta-repository.token';
import { ruta_estado_ruta } from '@prisma/client';
import { NotificationsService } from '../../../../application/notifications/notifications.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AsignarConductorUseCase {
  private readonly logger = new Logger(AsignarConductorUseCase.name);

  constructor(
    @Inject(RUTA_REPOSITORY_TOKEN)
    private readonly rutaRepo: RutaRepository,
    private readonly cambiarEstadoConductorUseCase: CambiarEstadoConductorUseCase,
    private readonly notificationsService: NotificationsService,
    private readonly prisma: PrismaService
  ) {}

  /**
   * Asigna un conductor a una ruta usando el código de manifiesto
   * @param codManifiesto - Código único de la ruta que agrupa los paquetes
   * @param idConductor - ID del conductor a asignar
   */
  async execute(codManifiesto: string, idConductor: number) {
    // =========================================
    // 1️⃣ VALIDAR CONDUCTOR
    // =========================================
    
    const conductor = await this.prisma.usuario.findUnique({
      where: { id_usuario: idConductor },
      include: { rol: true }
    });

    if (!conductor) {
      throw new NotFoundException(`Conductor con ID ${idConductor} no encontrado`);
    }

    // Validar que sea conductor por nombre de rol (más robusto)
    const esConductor = conductor.rol.nombre_rol.toLowerCase() === 'conductor';
    
    if (!esConductor) {
      throw new BadRequestException(
        `El usuario seleccionado no es un conductor. Rol actual: ${conductor.rol.nombre_rol}`
      );
    }

    this.logger.log(
      `✅ Conductor validado: ${conductor.nombre} ${conductor.apellido} (Rol: ${conductor.rol.nombre_rol})`
    );

    // =========================================
    // 2️⃣ BUSCAR RUTA POR CÓDIGO DE MANIFIESTO
    // =========================================
    
    const ruta = await this.prisma.ruta.findUnique({
      where: { cod_manifiesto: codManifiesto },
      include: {
        paquete: {
          select: {
            id_paquete: true,
            codigo_rastreo: true,
            estado_paquete: true
          }
        }
      }
    });

    if (!ruta) {
      throw new NotFoundException(
        `Ruta con código de manifiesto "${codManifiesto}" no encontrada`
      );
    }

    // Validar que la ruta esté en estado "Pendiente"
    if (ruta.estado_ruta !== 'Pendiente') {
      throw new BadRequestException(
        `Solo las rutas en estado "Pendiente" pueden ser asignadas. ` +
        `Estado actual de ${codManifiesto}: ${ruta.estado_ruta}`
      );
    }

    // Validar que la ruta tenga paquetes asignados
    if (ruta.paquete.length === 0) {
      throw new BadRequestException(
        `La ruta ${codManifiesto} no tiene paquetes asignados`
      );
    }

    this.logger.log(
      `📦 Ruta ${codManifiesto} tiene ${ruta.paquete.length} paquetes para entregar`
    );

    // =========================================
    // 3️⃣ ACTUALIZAR RUTA Y CONDUCTOR
    // =========================================
    
    this.logger.log(
      `🚚 Asignando conductor ${conductor.nombre} ${conductor.apellido} (ID: ${idConductor}) ` +
      `a ruta ${codManifiesto}`
    );

    // Actualizar la ruta
    const rutaActualizada = await this.rutaRepo.update(ruta.id_ruta, {
      id_conductor: idConductor,
      estado_ruta: 'Asignada' as ruta_estado_ruta
    });

    // Cambiar el estado del conductor a "En ruta"
    const conductorActualizado = await this.cambiarEstadoConductorUseCase.execute(
      idConductor,
      'En ruta'
    );

    // =========================================
    // 4️⃣ ENVIAR NOTIFICACIÓN AL CONDUCTOR
    // =========================================
    
    let notificacionEnviada = false;
    
    try {
      this.notificationsService.notifyRutaAsignadaAConductor(
        idConductor,
        ruta.id_ruta,
        codManifiesto
      );
      notificacionEnviada = true;
      this.logger.log(
        `✅ Notificación enviada al conductor ${conductor.nombre} ${conductor.apellido} ` +
        `para ruta ${codManifiesto}`
      );
    } catch (error) {
      this.logger.error(`❌ Error enviando notificación: ${error.message}`);
      // No lanzamos el error para que la asignación se complete
    }

    // =========================================
    // 5️⃣ RETORNAR DATOS
    // =========================================
    
    return {
      ruta: {
        ...rutaActualizada,
        totalPaquetes: ruta.paquete.length
      },
      conductor: {
        ...conductorActualizado,
        nombreCompleto: `${conductor.nombre} ${conductor.apellido}`
      },
      notificacionEnviada,
      mensaje: `Ruta ${codManifiesto} asignada exitosamente al conductor ${conductor.nombre} ${conductor.apellido}`
    };
  }
}