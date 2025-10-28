// src/prisma/prisma.service.ts
import {Injectable, OnModuleInit, OnModuleDestroy, Logger} from '@nestjs/common';
import {PrismaClient} from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: ['warn', 'error'],
      errorFormat: 'pretty',
    });
  }

  async onModuleInit() {
    try {
      this.logger.log('🔌 Conectando a la base de datos...');
      
      // Intentar conectar con timeout
      await Promise.race([
        this.$connect(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout al conectar a la base de datos')), 30000)
        )
      ]);
      
      this.logger.log('✅ Conexión a la base de datos establecida');
    } catch (error) {
      this.logger.error('❌ Error al conectar a la base de datos:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      this.logger.log('🔌 Desconectando de la base de datos...');
      await this.$disconnect();
      this.logger.log('✅ Desconexión exitosa');
    } catch (error) {
      this.logger.error('❌ Error al desconectar:', error);
    }
  }
}
