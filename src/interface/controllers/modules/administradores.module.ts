/* src/interface/modules/administradores.module.ts */
import {Module} from '@nestjs/common';
import {PrismaService} from 'src/infrastructure/persistence/prisma/prisma.service';
import {InfrastructureModule} from 'src/infrastructure/infrastructure.module';
import {UpdateAdminUseCase} from 'src/application/administrador/use-cases/update-admin.use-case';
import {AdministradoresController} from '../administradores.controller';

@Module({
  imports: [InfrastructureModule], // necesario para acceso a FirebaseAuthProvider si se requiere
  controllers: [AdministradoresController],
  providers: [PrismaService, UpdateAdminUseCase],
  exports: [UpdateAdminUseCase]
})
export class AdministradoresModule {}
