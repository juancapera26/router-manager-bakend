// src/shared/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'; // ← Asegurar que este import sea correcto

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Prisma conectado correctamente');
    } catch (error) {
      console.error('❌ Error conectando Prisma:', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}