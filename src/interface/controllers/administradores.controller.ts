/* src/interface/controllers/administradores.controller.ts */
import {
  Controller,
  Patch,
  Param,
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

  // Subir o actualizar foto del administrador
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

    return this.updateUC.execute(idNumber, {foto_perfil: fotoUrl});
  }
}
