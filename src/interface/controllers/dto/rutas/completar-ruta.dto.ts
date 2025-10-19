// src/interface/controllers/dto/rutas/completar-ruta.dto.ts
import {ApiProperty} from '@nestjs/swagger';
import {IsOptional, IsString, IsDateString} from 'class-validator';

export class CompletarRutaDto {
  @ApiProperty({
    description:
      'Fecha y hora de finalización real de la ruta (opcional, por defecto now())',
    example: '2024-03-15T18:00:00Z',
    type: 'string',
    format: 'date-time',
    required: false
  })
  @IsOptional()
  @IsDateString()
  fecha_fin_real?: string;
}
