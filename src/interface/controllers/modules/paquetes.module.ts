import {Module} from '@nestjs/common';
import {PaquetesController} from '../paquetes.controller';
import {PaquetesService} from '../../../paquetes/paquetes.service';
import {PrismaPaqueteRepository} from 'src/infrastructure/persistence/prisma/prisma-paquete.repository';
import {ClientesModule} from 'src/clientes/clientes.module';
import {PrismaService} from 'src/infrastructure/persistence/prisma/prisma.service';
//modulo

@Module({
  imports: [ClientesModule],
  controllers: [PaquetesController],
  providers: [PaquetesService, PrismaPaqueteRepository, PrismaService]
})
export class PaquetesModule {}
