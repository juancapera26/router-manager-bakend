import {Injectable, Inject} from '@nestjs/common';
import {ConductorRepository} from 'src/domain/conductores/repositories/conductor.repository';
import {ConductorRepositoryToken} from 'src/domain/conductores/tokens/conductor-repository.token';

@Injectable()
export class CambiarEstadoConductorUseCase {
  constructor(
    @Inject(ConductorRepositoryToken)
    private readonly conductorRepo: ConductorRepository
  ) {}

  async execute(idConductor: number, nuevoEstado: string) {
    // Usa el método update de tu repositorio
    return this.conductorRepo.update(idConductor, {estado: nuevoEstado});
  }
}
