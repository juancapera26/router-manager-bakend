import {Module} from '@nestjs/common';
import {PaquetesController} from '../paquetes.controller';
import {PaquetesService} from '../../../paquetes/paquetes.service';
import {PrismaService} from 'prisma/prisma.service';
import { ClientesModule } from 'src/clientes/clientes.module';
import {PrismaPaqueteRepository} from 'src/infrastructure/persistence/prisma/prisma-paquete.repository';


@Module({
  imports: [ClientesModule],
  controllers: [PaquetesController],
  providers: [PaquetesService, PrismaPaqueteRepository, PrismaService]
})
export class PaquetesModule {}
