import {Injectable, Inject} from '@nestjs/common';
import {ConductorRepositoryToken} from '../../../domain/conductores/tokens/conductor-repository.token';
import {ConductorRepository} from '../../../domain/conductores/repositories/conductor.repository';
import {UpdateConductorDto} from 'src/interface/controllers/dto/pdate-conductor.dto';

@Injectable()
export class UpdateConductorUseCase {
  constructor(
    @Inject(ConductorRepositoryToken)
    private readonly conductorRepo: ConductorRepository
  ) {}

  async execute(id: number, dto: UpdateConductorDto) {
    // Delegamos todo al repositorio
    return this.conductorRepo.update(id, dto);
  }
}
