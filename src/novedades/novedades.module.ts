import {Module} from '@nestjs/common';
import {NovedadesController} from './novedades.controller';
import {NovedadesService} from './novedades.service';
import {PrismaService} from 'prisma/prima.service';

@Module({
  controllers: [NovedadesController],
  providers: [NovedadesService, PrismaService]
})
export class NovedadesModule {}
