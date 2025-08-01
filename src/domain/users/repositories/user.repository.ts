import {Usuario} from '../entities/user.entity';

export interface UserRepository {
  create(usuario: Usuario): Promise<void>;
  findById(id_usuario: number): Promise<Usuario | null>;
  findByEmail(correo: string): Promise<Usuario | null>;
}
