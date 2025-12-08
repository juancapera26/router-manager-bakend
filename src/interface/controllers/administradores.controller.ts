/* src/interface/controllers/administradores.controller.ts */

import {
  Controller,
  Patch,
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
import {UpdateAdminUseCase} from 'src/application/administrador/use-cases/update-admin.use-case';

@Controller('administradores')
export class AdministradoresController {
  constructor(private readonly updateUC: UpdateAdminUseCase) {}

  // ======================
  // Actualizar DATOS del administrador
  // ======================
  @UseGuards(FirebaseAuthGuard)
  @Patch(':id')
  async updateAdmin(
    @Param('id') id: string,
    @Body()
    body: {
      nombre?: string;
      apellido?: string;
      telefono_movil?: string;
      tipo_documento?: string;
      correo?: string;
      documento?: string;
      id_empresa?: number;
    }
  ) {
    const idNumber = Number(id);
    if (isNaN(idNumber)) {
      throw new BadRequestException('ID inválido');
    }

    const result = await this.updateUC.execute(idNumber, body);
    
    // Transformar 'rol' a 'role' para que coincida con el frontend
    return {
      ...result,
      role: result.id_rol,
    };
  }

  // ======================
  // Subir o actualizar FOTO del administrador
  // ======================
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
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) throw new BadRequestException('No se subió ningún archivo');

    const fotoUrl = `http://localhost:3000/uploads/perfiles/${file.filename}`;
    const idNumber = Number(id);

    const result = await this.updateUC.execute(idNumber, {foto_perfil: fotoUrl});
    
    // Transformar 'rol' a 'role' para que coincida con el frontend
    return {
      ...result,
      role: result.id_rol,
    };
  }
}