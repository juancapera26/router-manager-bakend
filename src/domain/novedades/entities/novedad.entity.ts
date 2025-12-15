// entidad novedad

export class Novedad {
  constructor(
    public id_novedad: number,
    public descripcion: string,
    public tipo: string,
    public fecha: Date,
    public id_usuario: number,
    public imagen?: string | null
  ) {}
}
