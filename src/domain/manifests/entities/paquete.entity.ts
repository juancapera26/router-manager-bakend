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
  lat?: number; // número para mapas
  lng?: number;

  constructor(data: {
    codigo_rastreo: string | null;
    direccion: string;
    largo: number;
    ancho: number;
    alto: number;
    peso: number;
    estado_paquete: paquete_estado_paquete;
    tipo_paquete: paquete_tipo_paquete;
    lat?: number;
    lng?: number;
  }) {
    Object.assign(this, data);
  }
}
