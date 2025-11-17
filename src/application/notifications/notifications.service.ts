import { Injectable, Logger } from '@nestjs/common';
import { NotificationsGateway, NotificationPayload } from '../../infrastructure/notifications/notifications.gateway';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly notificationsGateway: NotificationsGateway) {}

  /**
   * Notifica a todos los administradores excepto quien ejecutó la acción
   * Usado cuando un admin marca una ruta como Completada o Fallida
   */
  notifyAllAdmins(notification: NotificationPayload){
    this.notificationsGateway.notifyAllAdmins(notification);
    this.logger.log(
      `Notificacion enviada a todos los admins: ${notification.message}`
    );
  }

  notifyAdminsExcept(
    adminIdQueEjecuto: number,
    idRuta: number,
    codManifiesto: string,
    nuevoEstado: 'Completada' | 'Fallida'
  ){
    const notificacion: NotificationPayload = {
      type: nuevoEstado === 'Completada' ? 'ruta_completada' : 'ruta_fallida',
      title: `Ruta ${nuevoEstado}`,
      message: `La ruta ${codManifiesto} ha sido marcada como ${nuevoEstado}`,
      data: {
        id_ruta: idRuta,
        cod_manifiesto: codManifiesto,
        estado_ruta: nuevoEstado,
      },
      timestamp: new Date(),
    };
    

    this.notificationsGateway.notifyAdminsExcept(adminIdQueEjecuto, notificacion);
    this.logger.log(
      `Notificacion enviada a admins (except ID ${adminIdQueEjecuto}): Ruta ${codManifiesto} -> ${nuevoEstado}`
    );
  }

  notifyRutaEstadoCambiado(
    adminIdQueEjecuto: number,
    idRuta: number,
    codManifiesto: string,
    nuevoEstado: 'Completada' | 'Fallida'
  ) {
    const notification: NotificationPayload = {
      type: nuevoEstado === 'Completada' ? 'ruta_completada' : 'ruta_fallida',
      title: `Ruta ${nuevoEstado}`,
      message: `La ruta ${codManifiesto} ha sido marcada como ${nuevoEstado}`,
      data: {
        id_ruta: idRuta,
        cod_manifiesto: codManifiesto,
        estado_ruta: nuevoEstado,
      },
      timestamp: new Date(),
    };

    this.notificationsGateway.notifyAdminsExcept(adminIdQueEjecuto, notification);
    this.logger.log(
      `Notificación enviada a admins: Ruta ${codManifiesto} -> ${nuevoEstado}`
    );
  }

  /**
   * Notifica al conductor cuando se le asigna una ruta
   */
  notifyRutaAsignadaAConductor(
    idConductor: number,
    idRuta: number,
    codManifiesto: string
  ) {
    const notification: NotificationPayload = {
      type: 'ruta_asignada',
      title: 'Nueva Ruta Asignada',
      message: `Se te ha asignado la ruta con código de manifiesto ${codManifiesto}`,
      data: {
        id_ruta: idRuta,
        cod_manifiesto: codManifiesto,
        id_conductor: idConductor,
      },
      timestamp: new Date(),
    };

    this.notificationsGateway.notifyConductor(idConductor, notification);
    this.logger.log(
      `Notificación enviada al conductor ID ${idConductor}: Ruta ${codManifiesto} asignada`
    );
  }
}