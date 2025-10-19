import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { PrismaService } from '../infrastructure/persistence/prisma/prisma.service';

@Module({
  controllers: [ClientesController],
  providers: [ClientesService, PrismaService],
  exports: [ClientesService], // 👈 exportar para usar en Paquetes
})
export class ClientesModule {}
