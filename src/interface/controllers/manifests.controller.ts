//src/interface/controllers/manifests.module.ts
import {Controller, Get, Param} from '@nestjs/common';
import {GetPaquetesUseCase} from 'src/application/manifests/use-cases/get-paquetes.use-case';
import {Paquete} from 'src/domain/manifests/entities/paquete.entity';

@Controller('api/manifiestos')
export class ManifestsController {
  constructor(private readonly getPaquetesUseCase: GetPaquetesUseCase) {}

  @Get(':codigo')
  async getPaquetes(
    @Param('codigo') codigo: string
  ): Promise<{codigo: string; paquetes: Paquete[]}> {
    const paquetes = await this.getPaquetesUseCase.execute(codigo);
    return {codigo, paquetes};
  }
}
