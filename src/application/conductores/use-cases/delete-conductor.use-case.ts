import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {ConductorRepository} from '../../../domain/conductores/repositories/conductor.repository';
import {ConductorRepositoryToken} from 'src/domain/conductores/tokens/conductor-repository.token';
import {FirebaseAuthProvider} from 'src/infrastructure/auth/firebase-auth.provider';

@Injectable()
export class DeleteConductorUseCase {
  constructor(
    @Inject(ConductorRepositoryToken)
    private conductorRepo: ConductorRepository,
    private readonly firebaseAuthProvider: FirebaseAuthProvider
  ) {}

  async execute(id: number): Promise<void> {
    const conductor = await this.conductorRepo.findById(id);
    if (!conductor) throw new NotFoundException('Conductor no encontrado');

    if (conductor.uid) {
      try {
        await this.firebaseAuthProvider.deleteUser(conductor.uid);
      } catch (error) {
        console.error('Error al eliminar usuario Firebase:', error);
      }
    }

    await this.conductorRepo.delete(id);
  }
}
