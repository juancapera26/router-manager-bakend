// update-paquete.dto.ts
//actualizar paquete1
import {PartialType} from '@nestjs/mapped-types';
import {CreatePaqueteDto} from './create-paquete.dto';
export class UpdatePaqueteDto extends PartialType(CreatePaqueteDto) {
  largo: undefined;
  ancho: undefined;
  alto: undefined;
  peso: undefined;
  id_ruta: undefined;
  fecha_entrega: undefined;
  id_cliente: undefined;
}