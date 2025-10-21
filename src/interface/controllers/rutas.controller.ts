import {Controller, Get} from '@nestjs/common';
import {GetAllRutasUseCase} from 'src/application/logistica/rutas/use-cases/get-all-rutas.use-case';

@Controller('rutas')
export class RutasController {
  constructor(private readonly getAllRutasUseCase: GetAllRutasUseCase) {}

  @Get()
  async getAll() {
    return await this.getAllRutasUseCase.execute();
  }
}
