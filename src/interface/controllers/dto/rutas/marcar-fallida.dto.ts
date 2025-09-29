// src/interface/controllers/dto/rutas/marcar-fallida.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class MarcarFallidaDto {
  @ApiProperty({
    description: 'Fecha y hora cuando se marcó como fallida (opcional, por defecto now())',
    example: '2024-03-15T14:30:00Z',
    type: 'string',
    format: 'date-time',
    required: false
  })
  @IsOptional()
  @IsDateString()
  fecha_falla?: string;
}
