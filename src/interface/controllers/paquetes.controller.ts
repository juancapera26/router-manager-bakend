import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Patch,
  UseInterceptors,
  UploadedFile,
  NotFoundException
} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import {extname} from 'path';

// Servicios
import {PaquetesService} from '../../paquetes/paquetes.service';

// Repositorio
import {PrismaPaqueteRepository} from 'src/infrastructure/persistence/prisma/prisma-paquete.repository';

// DTOs
import {CreatePaqueteDto} from './dto/create-paquete.dto';
import {UpdatePaqueteDto} from './dto/update-paquete.dto';
import {AsignarPaqueteDto} from './dto/asignar-paquete.dto';
import {EstadoPaqueteDto} from './dto/estado-paquete.dto';
import {RegistrarEntregaDto} from './dto/paquetes/registrar-entrega.dto';

// Tipos Prisma
import {paquete_estado_paquete} from '@prisma/client';

@Controller('paquetes')
export class PaquetesController {
  constructor(
    private readonly paquetesService: PaquetesService,
    private readonly prismaPaqueteRepository: PrismaPaqueteRepository
  ) {}
  
  // Obtener todos los paquetes
  @Get()
  getAll() {
    return this.paquetesService.getAll();
  }

  // Buscar por estado
  @Get('estado/:estado')
  findByEstado(@Param('estado') estado: paquete_estado_paquete) {
    return this.paquetesService.findByEstado(estado);
  }

  //  Obtener paquetes de una ruta específica
  @Get('ruta/:id_ruta')
  findByRuta(@Param('id_ruta') id_ruta: string) {
    return this.paquetesService.findByRuta(Number(id_ruta));
  }

  // Obtener un paquete por ID (debe ir al final de los GET para evitar conflictos)
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.paquetesService.getOne(Number(id));
  }

  // Crear paquete
  @Post()
  create(@Body() dto: CreatePaqueteDto) {
    return this.paquetesService.create(dto);
  }

  // Registrar entrega con imagen
  @Post(':id/entrega')
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './uploads/entregas',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `entrega-${uniqueSuffix}${ext}`);
        }
      })
    })
  )
  async registrarEntrega(
    @Param('id') id: string,
    @Body() dto: RegistrarEntregaDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    const imagePath = file ? `/uploads/entregas/${file.filename}` : null;

    const paquete = await this.prismaPaqueteRepository.findById(Number(id));
    if (!paquete) throw new NotFoundException('Paquete no encontrado');

    const now = new Date();
    const fechaLocal = new Date(
      now.getTime() - now.getTimezoneOffset() * 60000
    );

    return this.prismaPaqueteRepository.cambiarEstado(
      Number(id),
      dto.estado_paquete,
      dto.observacion_entrega,
      imagePath,
      fechaLocal
    );
  }
  // Actualizar paquete
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePaqueteDto) {
    return this.paquetesService.update(Number(id), dto);
  }

  // Asignar paquete a ruta
  @Put(':id/asignar')
  asignar(@Param('id') id: string, @Body() dto: AsignarPaqueteDto) {
    return this.paquetesService.asignar(Number(id), dto);
  }

  // Reasignar paquete
  @Put(':id/reasignar')
  reasignar(@Param('id') id: string, @Body() dto: AsignarPaqueteDto) {
    return this.paquetesService.reasignar(Number(id), dto);
  }

  // Cancelar paquete (quita de ruta y vuelve a Pendiente)
  @Put(':id/cancelar')
  cancelar(@Param('id') id: string) {
    return this.paquetesService.cancelar(Number(id));
  }

  // Cambiar estado de paquete
  @Put(':id/estado')
  cambiarEstado(@Param('id') id: string, @Body() dto: EstadoPaqueteDto) {
    return this.paquetesService.cambiarEstado(Number(id), dto);
  }

  // Reasignar paquete con PATCH (alternativa)
  @Patch(':id/reasignar')
  reassignPaquete(
    @Param('id') id: string,
    @Body('id_conductor') id_conductor: number,
    @Body('id_ruta') id_ruta: number
  ) {
    return this.paquetesService.reasignar(Number(id), {id_ruta, id_conductor});
  }

  // Eliminar paquete
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.paquetesService.delete(Number(id));
  }
}