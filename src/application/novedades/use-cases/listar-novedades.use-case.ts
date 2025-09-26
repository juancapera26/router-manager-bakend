import {Inject, Injectable} from '@nestjs/common';
import {NovedadRepositoryToken} from '../../../domain/novedades/tokens/novedad-repository.token';
import {NovedadRepository} from '../../../domain/novedades/repositories/novedad.repository';

@Injectable()
export class ListarNovedadesUseCase {
  constructor(
    @Inject(NovedadRepositoryToken)
    private readonly novedadesRepo: NovedadRepository
  ) {}

  async execute() {
    return this.novedadesRepo.listar();
  }
}
