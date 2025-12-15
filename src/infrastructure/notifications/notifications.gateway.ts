import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';


export interface NotificationPayload {
  type: 'ruta_completada' | 'ruta_fallida' | 'ruta_asignada' | 'reporte_creado';
  title: string;
  message: string;
  data?: {
    id_ruta?: number;
    cod_manifiesto?: string;
    estado_ruta?: string;
    id_conductor?: number;
    id_novedad?: number,
    tipo_novedad?: string,
    
  };
  timestamp: Date;
}

interface ConnectedUser {
  socketId: string;
  userId: number;
  role: string; // 'Admin' o 'Conductor'
}

@WebSocketGateway({
  cors: {
    origin: '*', // ⚠️ En producción, cambia esto por tu dominio
    credentials: true,
  },
  // ✅ SIN namespace - se conecta a la raíz
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  
  // Mapa: userId -> ConnectedUser
  private connectedUsers: Map<number, ConnectedUser> = new Map();

  // =========================================
  // CONEXIÓN
  // =========================================
  handleConnection(client: Socket) {
    this.logger.log(`👤 Cliente conectado: ${client.id}`);
  }

  // =========================================
  // DESCONEXIÓN
  // =========================================
  handleDisconnect(client: Socket) {
    this.logger.log(`👋 Cliente desconectado: ${client.id}`);
    
    // Buscar y eliminar usuario del mapa
    for (const [userId, user] of this.connectedUsers.entries()) {
      if (user.socketId === client.id) {
        this.logger.log(`🗑️ Usuario ${userId} (${user.role}) eliminado del registro`);
        this.connectedUsers.delete(userId);
        break;
      }
    }
  }

  // =========================================
  // REGISTRO DE USUARIO
  // =========================================
  @SubscribeMessage('register')
  handleRegister(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { userId: number; role: string }
  ) {
    const { userId, role } = payload;

    this.logger.log(`📝 Registrando usuario: userId=${userId}, role=${role}, socketId=${client.id}`);

    // Guardar usuario en el mapa (por userId, no por socketId)
    this.connectedUsers.set(userId, {
      socketId: client.id,
      userId,
      role,
    });

    this.logger.log(`✅ Usuario ${userId} registrado correctamente. Total conectados: ${this.connectedUsers.size}`);
    
    // Debug: Mostrar todos los usuarios conectados
    this.logger.debug(`📊 Usuarios conectados:`);
    for (const [id, user] of this.connectedUsers.entries()) {
      this.logger.debug(`   - ID ${id}: ${user.role} (socket: ${user.socketId})`);
    }

    // Confirmar registro al cliente
    client.emit('registered', { 
      success: true, 
      userId,
      message: 'Registrado correctamente en el sistema de notificaciones' 
    });
  }

  // =========================================
  // NOTIFICAR A CONDUCTOR ESPECÍFICO
  // =========================================
  notifyConductor(conductorId: number, notification: NotificationPayload) {
    const user = this.connectedUsers.get(conductorId);

    if (!user) {
      this.logger.warn(`⚠️ Conductor ID ${conductorId} no está conectado`);
      this.logger.debug(`📋 Conductores conectados: ${this.getConnectedByRole('Conductor').map(u => u.userId).join(', ') || 'ninguno'}`);
      return;
    }

    if (user.role !== 'Conductor') {
      this.logger.warn(`⚠️ Usuario ${conductorId} no es un conductor (rol actual: ${user.role})`);
      return;
    }

    this.logger.log(`📤 Enviando notificación al conductor ${conductorId} (socket: ${user.socketId})`);
    this.server.to(user.socketId).emit('notification', notification);
    this.logger.log(`✅ Notificación enviada: ${notification.message}`);
  }

  // =========================================
  // NOTIFICAR A TODOS LOS ADMINS
  // =========================================
  notifyAllAdmins(notification: NotificationPayload) {
    const admins = this.getConnectedByRole('Admin');

    if (admins.length === 0) {
      this.logger.warn('⚠️ No hay administradores conectados');
      return;
    }

    this.logger.log(`📤 Enviando notificación a ${admins.length} administrador(es)`);
    
    admins.forEach((admin) => {
      this.server.to(admin.socketId).emit('notification', notification);
      this.logger.log(`   ✅ Enviado a admin ID ${admin.userId}`);
    });
  }

  // =========================================
  // NOTIFICAR A ADMINS EXCEPTO UNO
  // =========================================
  notifyAdminsExcept(excludeUserId: number, notification: NotificationPayload) {
    const admins = this.getConnectedByRole('Admin').filter(
      (admin) => admin.userId !== excludeUserId
    );

    if (admins.length === 0) {
      this.logger.warn(`⚠️ No hay otros administradores conectados (excluyendo ID ${excludeUserId})`);
      return;
    }

    this.logger.log(`📤 Enviando notificación a ${admins.length} administrador(es) (excluyendo ID ${excludeUserId})`);
    
    admins.forEach((admin) => {
      this.server.to(admin.socketId).emit('notification', notification);
      this.logger.log(`   ✅ Enviado a admin ID ${admin.userId}`);
    });
  }

  // =========================================
  // UTILIDADES
  // =========================================

  /**
   * Obtiene usuarios conectados por rol
   */
  private getConnectedByRole(role: string): ConnectedUser[] {
    return Array.from(this.connectedUsers.values()).filter(
      (user) => user.role === role
    );
  }

  /**
   * Verifica si un usuario está conectado
   */
  isUserConnected(userId: number): boolean {
    return this.connectedUsers.has(userId);
  }

  /**
   * Obtiene todos los usuarios conectados (para debugging)
   */
  getConnectedUsers(): ConnectedUser[] {
    return Array.from(this.connectedUsers.values());
  }
}