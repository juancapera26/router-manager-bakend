// domain/conductores/repositories/conductor.repository.ts
import {ConductorEntity} from '../entities/conductor.entity';

export interface ConductorRepository {
  update(id: number, data: Partial<ConductorEntity>): Promise<ConductorEntity>;
  // otros métodos...
}
