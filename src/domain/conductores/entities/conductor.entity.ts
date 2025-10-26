export class EmpresaEntity {
  id_empresa: number;
  nombre_empresa: string;
  nit: string;
  telefono_empresa: string;
}

export class ConductorEntity {
  id: string;
  userId: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  foto_perfil: string | null;
  empresa?: EmpresaEntity | null;
  uid: string;
  estado?: string; // 👈 agrega este campo
}

export class Conductor {
  constructor(
    public readonly id_usuario: number,
    public readonly nombre: string,
    public readonly apellido: string,
    public readonly correo: string,
    public readonly telefono_movil?: string,
    public readonly estado_conductor?: string,
    public readonly empresa?: {
      id_empresa: number;
      nombre_empresa: string;
      nit: string;
      telefono_empresa: string;
    }
  ) {}
}
