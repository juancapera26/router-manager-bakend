export class RegisterDto {
  email: string;
  password: string;
  role: string; // puedes usar number si tu DB lo requiere
  isPublicRegistration: boolean;
  nombre: string;
  apellido: string;
  telefono_movil: string;
  id_empresa: string;
  tipo_documento: string;
  documento: string;
}
