import {paquete_estado_paquete, paquete_tipo_paquete} from '@prisma/client';

export class Paquetes {
  id_paquete: number;
  codigo_rastreo: string | null;
  direccion: string | null; // 👈 corresponde a direccion_entrega en Prisma
  largo: number;
  ancho: number;
  alto: number;
  peso: number;
  estado_paquete: paquete_estado_paquete;
  tipo_paquete: paquete_tipo_paquete;
  lat?: number | null;
  lng?: number | null;
  valor_declarado: number;
  cantidad: number;
  fecha_registro: Date;
  fecha_entrega: Date | null;
  id_cliente: number;
  id_ruta?: number | null;
  id_barrio?: number | null;

  constructor(data: {
    id_paquete: number;
    codigo_rastreo: string | null;
    direccion: string | null;
    largo: number;
    ancho: number;
    alto: number;
    peso: number;
    estado_paquete: paquete_estado_paquete;
    tipo_paquete: paquete_tipo_paquete;
    lat?: number | null;
    lng?: number | null;
    valor_declarado: number;
    cantidad: number;
    fecha_registro: Date;
    fecha_entrega: Date | null;
    id_cliente: number;
    id_ruta?: number | null;
    id_barrio?: number | null;
  }) {
    Object.assign(this, data);
  }
}
