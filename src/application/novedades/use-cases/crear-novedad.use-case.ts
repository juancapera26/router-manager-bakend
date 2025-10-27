import {Injectable, Inject} from '@nestjs/common';
import {
  NovedadRepository,
  CrearNovedadProps
} from '../../../domain/novedades/repositories/novedad.repository';
import {Novedad} from '../../../domain/novedades/entities/novedad.entity';
import {NovedadRepositoryToken} from 'src/domain/novedades/tokens/novedad-repository.token';

@Injectable()
export class CrearNovedadUseCase {
  constructor(
    @Inject(NovedadRepositoryToken)
    private readonly novedadRepo: NovedadRepository
  ) {}

  async execute(
    data: CrearNovedadProps,
    file: Express.MulterFile | undefined
  ): Promise<Novedad> {
    let imagenPath: string | null = null;

    if (file) {
      // Multer ya guardó el archivo en ./uploads
      imagenPath = `uploads/${file.filename}`;
    }

    // Llamada al repositorio con la ruta de imagen si existe
    return this.novedadRepo.crear({
      ...data,
      imagen: imagenPath
    });
  }
}
