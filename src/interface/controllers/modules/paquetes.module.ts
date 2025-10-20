import {Module} from '@nestjs/common';
import {PaquetesController} from '../paquetes.controller';
import {PaquetesService} from '../../../paquetes/paquetes.service';
import {PrismaService} from 'prisma/prisma.service';
import { ClientesModule } from 'src/clientes/clientes.module';

@Module({
  imports: [ClientesModule],
  controllers: [PaquetesController],
  providers: [PaquetesService, PrismaService]
})
export class PaquetesModule {}
