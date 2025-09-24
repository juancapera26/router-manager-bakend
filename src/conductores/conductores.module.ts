//conductores.module.ts
import { Module } from '@nestjs/common';
import { ConductoresController } from './conductores.controller';
import { ConductoresService } from './conductores.service';
import { PrismaService } from 'prisma/prima.service';

@Module({
  controllers: [ConductoresController],
  providers: [ConductoresService, PrismaService],
})
export class ConductoresModule {}
