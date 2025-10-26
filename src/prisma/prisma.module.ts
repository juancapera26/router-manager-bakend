// src/prisma/prisma.module.ts
import {Global, Module} from '@nestjs/common';
import {PrismaService} from './prisma.service';

@Global() // lo vuelve disponible en toda la app sin importar el módulo
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {}
