export class Ubicacion {
  constructor(
    public readonly id_ubicacion: number,
    public readonly id_ruta: number,
    public readonly lat: number,
    public readonly lng: number,
    public readonly fecha_registro: Date
  ) {}
}
