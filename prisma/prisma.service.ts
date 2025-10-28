// src/prisma/prisma.service.ts
import {Injectable, OnModuleInit, OnModuleDestroy} from '@nestjs/common';
import {PrismaClient} from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect(); // se conecta a la BD al iniciar
  }

  async onModuleDestroy() {
    await this.$disconnect(); // cierra la conexión al apagar la app
  }
}
