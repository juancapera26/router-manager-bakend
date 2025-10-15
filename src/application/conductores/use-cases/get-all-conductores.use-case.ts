import {Injectable, Inject} from '@nestjs/common';
import {ConductorRepositoryToken} from '../../../domain/conductores/tokens/conductor-repository.token';
import {ConductorRepository} from '../../../domain/conductores/repositories/conductor.repository';
import {ConductorEntity} from '../../../domain/conductores/entities/conductor.entity';

@Injectable()
export class GetAllConductoresUseCase {
  constructor(
    @Inject(ConductorRepositoryToken)
    private readonly conductorRepo: ConductorRepository
  ) {}

  execute(): Promise<ConductorEntity[]> {
    return this.conductorRepo.findAll();
  }
}
