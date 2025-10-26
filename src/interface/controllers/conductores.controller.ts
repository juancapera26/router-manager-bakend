import {
  Controller,
  Get,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException
} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import {join} from 'path';
import {existsSync, mkdirSync} from 'fs';
import {FirebaseAuthGuard} from '../../auth/guards/firebase-auth.guard';
import {UpdateConductorUseCase} from '../../application/conductores/use-cases/update-conductor.use-case';
import {DeleteConductorUseCase} from '../../application/conductores/use-cases/delete-conductor.use-case';
import {UpdateConductorDto} from './dto/pdate-conductor.dto';
import {GetAllConductoresUseCase} from 'src/application/conductores/use-cases/get-all-conductores.use-case';

@Controller('conductores')
export class ConductoresController {
  constructor(
    private readonly getAllUC: GetAllConductoresUseCase,
    private readonly updateUC: UpdateConductorUseCase,
    private readonly deleteUC: DeleteConductorUseCase
  ) {}

  // Listar todos los conductores
  @UseGuards(FirebaseAuthGuard)
  @Get()
  findAll() {
    return this.getAllUC.execute();
  }

  // Actualizar conductor (nombre, apellido, correo, teléfono)
  @UseGuards(FirebaseAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateConductorDto) {
    const idNumber = Number(id);
    return this.updateUC.execute(idNumber, data);
  }

  // Actualizar foto del conductor
  @UseGuards(FirebaseAuthGuard)
  @Patch(':id/foto')
  @UseInterceptors(
    FileInterceptor('foto', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(process.cwd(), 'uploads', 'perfiles');
          if (!existsSync(uploadPath)) mkdirSync(uploadPath, {recursive: true});
          cb(null, uploadPath);
        },
        filename: (req, file, cb) =>
          cb(null, `${Date.now()}-${file.originalname}`)
      })
    })
  )
  async updateFoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.MulterFile
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    const fotoUrl = `http://localhost:8080/uploads/perfiles/${file.filename}`;
    const idNumber = Number(id);
    return this.updateUC.execute(idNumber, {foto_perfil: fotoUrl});
  }

  // Actualizar solo teléfono
  @UseGuards(FirebaseAuthGuard)
  @Patch(':id/telefono')
  async updateTelefono(
    @Param('id') id: string,
    @Body() body: {telefono: string}
  ) {
    const idNumber = Number(id);
    const telefono = body.telefono;

    if (!telefono)
      throw new BadRequestException('El teléfono no puede estar vacío');
    if (!/^\d+$/.test(telefono))
      throw new BadRequestException('El teléfono solo debe contener números');
    if (telefono.length !== 10)
      throw new BadRequestException('El teléfono debe tener 10 dígitos');

    return this.updateUC.execute(idNumber, {telefono});
  }

  // Eliminar conductor
  @UseGuards(FirebaseAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    const idNumber = Number(id);
    return this.deleteUC.execute(idNumber);
  }
}
