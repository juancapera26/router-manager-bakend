import { Module } from '@nestjs/common';
import { NotificationsGateway } from '../../../infrastructure/notifications/notifications.gateway';
import { NotificationsService } from './../../../application/notifications/notifications.service';

@Module({
  providers: [NotificationsGateway, NotificationsService],
  exports: [NotificationsService, NotificationsGateway], // ✅ Exportar para usar en otros módulos
})
export class NotificationsModule {}