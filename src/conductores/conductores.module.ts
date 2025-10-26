//conductores.module.ts
import {Module} from '@nestjs/common';
import {ConductoresService} from './conductores.service';
import {PrismaService} from '../prisma/prisma.service';

@Module({
  controllers: [],
  providers: [ConductoresService, PrismaService]
})
export class ConductoresModule {}
