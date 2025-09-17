import {paquete_estado_paquete, paquete_tipo_paquete} from '@prisma/client';

export class Paquete {
  codigo_rastreo: string | null;
  direccion: string;
  largo: number;
  ancho: number;
  alto: number;
  peso: number;
  estado_paquete: paquete_estado_paquete;
  tipo_paquete: paquete_tipo_paquete;
  lat?: number | null; // 👈 reflejar nullable
  lng?: number | null; // 👈 reflejar nullable

  constructor(data: {
    codigo_rastreo: string | null;
    direccion: string;
    largo: number;
    ancho: number;
    alto: number;
    peso: number;
    estado_paquete: paquete_estado_paquete;
    tipo_paquete: paquete_tipo_paquete;
    lat?: number | null;
    lng?: number | null;
  }) {
    Object.assign(this, data);
  }
}
