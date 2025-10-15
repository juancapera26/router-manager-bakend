// src/interface/controllers/dto/rutas/iniciar-ruta.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString } from 'class-validator';

export class IniciarRutaDto {
  @ApiProperty({
    description: 'Fecha y hora de inicio real de la ruta (opcional, por defecto now())',
    example: '2024-03-15T08:00:00Z',
    type: 'string',
    format: 'date-time',
    required: false
  })
  @IsOptional()
  @IsDateString()
  fecha_inicio_real?: string;
}