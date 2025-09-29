import {
  Controller,
  Param,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Body // Asegúrate de importar Body para actualizar el teléfono
} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import {join} from 'path';
import {existsSync, mkdirSync} from 'fs';
import {UpdateConductorUseCase} from '../../application/conductores/use-cases/update-conductor.use-case';
import {FirebaseAuthGuard} from '../../auth/guards/firebase-auth.guard';

@Controller('conductores')
export class ConductoresController {
  constructor(
    private readonly updateConductorUseCase: UpdateConductorUseCase
  ) {}

  @UseGuards(FirebaseAuthGuard)
  @Patch(':id') // Endpoint para actualizar el teléfono
  async updateTelefono(
    @Param('id') id: string,
    @Body() body: {telefono: string} // El cuerpo contendría el teléfono
  ) {
    const idNumber = Number(id);

    if (!body.telefono) {
      return {message: 'El teléfono no puede estar vacío'};
    }

    // Validación del teléfono (asegurarse de que tenga solo números y tenga 10 dígitos)
    if (!/^\d+$/.test(body.telefono)) {
      return {message: 'El teléfono solo debe contener números'};
    }

    if (body.telefono.length !== 10) {
      return {message: 'El teléfono debe tener 10 dígitos'};
    }

    try {
      // Llama al caso de uso que actualiza el teléfono del conductor
      return await this.updateConductorUseCase.execute(idNumber, {
        telefono: body.telefono // Actualización del teléfono
      });
    } catch (err) {
      console.error('Error al actualizar conductor:', err);
      throw err;
    }
  }

  @UseGuards(FirebaseAuthGuard)
  @Patch(':id/foto') // Endpoint para actualizar la foto
  @UseInterceptors(
    FileInterceptor('foto', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(process.cwd(), 'uploads', 'perfiles');
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, {recursive: true});
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        }
      })
    })
  )
  async updateFoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      console.log('No file uploaded');
      return {message: 'No file uploaded'};
    }

    const fotoUrl = `http://localhost:3000/uploads/perfiles/${file.filename}`; // URL estática
    const idNumber = Number(id);

    console.log('Updated Foto URL:', fotoUrl);
    console.log('Conductor ID:', idNumber);

    try {
      return await this.updateConductorUseCase.execute(idNumber, {
        foto_perfil: fotoUrl // Actualización de la foto
      });
    } catch (err) {
      console.error('Error al actualizar conductor:', err);
      throw err; // Puedes lanzar un error más descriptivo si lo prefieres.
    }
  }
}
