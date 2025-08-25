export class Usuario {
  constructor(
    public readonly correo: string,
    public readonly contrasena: string,
    public readonly nombre: string, // 👈 ya no acepta null
    public readonly apellido: string, // 👈 ya no acepta null
    public readonly telefono_movil: string | null,
    public readonly id_empresa: number,
    public readonly id_rol: number,
    public readonly tipo_documento: string | null,
    public readonly documento: string | null,
    public readonly uid: string
  ) {}
}
