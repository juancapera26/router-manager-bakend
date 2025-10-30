// domain/conductores/repositories/conductor.repository.ts
import {ConductorEntity} from '../entities/conductor.entity';

export interface ConductorRepository {
  findAll(): Promise<ConductorEntity[]>;
  findById(id: number): Promise<ConductorEntity | null>;
  update(id: number, data: Partial<ConductorEntity>): Promise<ConductorEntity>;
  delete(id: number): Promise<void>;

  // otros métodos...
}
