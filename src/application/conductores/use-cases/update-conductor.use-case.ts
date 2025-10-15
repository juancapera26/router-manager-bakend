import {Injectable, Inject} from '@nestjs/common';
import {ConductorRepositoryToken} from '../../../domain/conductores/tokens/conductor-repository.token';
import {ConductorRepository} from '../../../domain/conductores/repositories/conductor.repository';
import {ConductorEntity} from '../../../domain/conductores/entities/conductor.entity';

@Injectable()
export class UpdateConductorUseCase {
  constructor(
    @Inject(ConductorRepositoryToken)
    private conductorRepo: ConductorRepository
  ) {}

  execute(
    id: number,
    data: Partial<ConductorEntity>
  ): Promise<ConductorEntity> {
    return this.conductorRepo.update(id, data);
  }
}
