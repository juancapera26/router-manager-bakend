import {
  Controller,
  Get,
  Param,
  ForbiddenException,
  Inject,
  UseGuards
} from '@nestjs/common';
import {GetPaquetesUseCase} from 'src/application/manifests/use-cases/get-paquetes.use-case';
import {Paquete} from 'src/domain/manifests/entities/paquete.entity';
import {User} from 'src/auth/guards/decorators/user.decorator';
import {RUTA_REPOSITORY_TOKEN} from 'src/domain/logistica/rutas/tokens/ruta-repository.token';
import {RutaRepository} from 'src/domain/logistica/rutas/repositories/ruta.repository';
import {FirebaseAuthGuard} from 'src/auth/guards/firebase-auth.guard';

@Controller('api/manifiestos')
@UseGuards(FirebaseAuthGuard)
export class ManifestsController {
  constructor(
    private readonly getPaquetesUseCase: GetPaquetesUseCase,
    @Inject(RUTA_REPOSITORY_TOKEN)
    private readonly rutasRepository: RutaRepository
  ) {}

  @Get(':codigo')
  async getPaquetes(
    @Param('codigo') codigo: string,
    @User() user: any
  ): Promise<{codigo: string; paquetes: Paquete[]}> {
    // 🔹 Buscar la ruta asociada al código de manifiesto
    const ruta = await this.rutasRepository.findByCodigoManifiesto(codigo);

    if (!ruta) {
      throw new ForbiddenException('Ruta no encontrada para este manifiesto');
    }

    // 🔹 Buscar el usuario en la base de datos por UID de Firebase
    const usuario = await this.rutasRepository.findUsuarioByUid(user.uid);

    if (!usuario) {
      throw new ForbiddenException('Usuario no encontrado en la base de datos');
    }

    // 🔹 Depurar valores
    console.log('UID Firebase:', user.uid);
    console.log('Usuario DB:', usuario);
    console.log('ID conductor de la ruta:', ruta.id_conductor);

    // 🔹 Validar que el usuario logueado es el conductor asignado
    if (ruta.id_conductor !== usuario.id_usuario) {
      throw new ForbiddenException(
        'No tienes permiso para ver los paquetes de esta ruta'
      );
    }

    // 🔹 Obtener paquetes del manifiesto
    const paquetes = await this.getPaquetesUseCase.execute(codigo);
    return {codigo, paquetes};
  }
}
