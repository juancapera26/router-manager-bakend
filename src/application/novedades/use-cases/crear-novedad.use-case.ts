import {Injectable, Inject} from '@nestjs/common';
import {
  NovedadRepository,
  CrearNovedadProps
} from '../../../domain/novedades/repositories/novedad.repository';
import {Novedad} from '../../../domain/novedades/entities/novedad.entity';
import {NovedadRepositoryToken} from 'src/domain/novedades/tokens/novedad-repository.token';
import {NotificationsService} from 'src/application/notifications/notifications.service';
import {PrismaService} from 'prisma/prisma.service';

@Injectable()
export class CrearNovedadUseCase {
  constructor(
    @Inject(NovedadRepositoryToken)
    private readonly novedadRepo: NovedadRepository,
    @Inject(PrismaService) // ✅ Agregar @Inject explícito
    private readonly prisma: PrismaService,
    @Inject(NotificationsService) // ✅ Agregar @Inject explícito
    private readonly notificationsService: NotificationsService
  ) {}

  async execute(
    data: CrearNovedadProps,
    file: Express.Multer.File | undefined
  ): Promise<Novedad> {
    let imagenPath: string | null = null;

    if (file) {
      imagenPath = `uploads/${file.filename}`;
    }

    const novedad = await this.novedadRepo.crear({
      ...data,
      imagen: imagenPath
    });

    const conductor = await this.prisma.usuario.findUnique({
      where: { id_usuario: data.id_usuario },
      select: { nombre: true, apellido: true }
    });

    const nombreCompleto = conductor 
      ? `${conductor.nombre} ${conductor.apellido}` 
      : 'Desconocido';

    this.notificationsService.notifyReporteCreado(
      data.id_usuario,
      nombreCompleto,
      novedad.id_novedad,
      data.tipo
    );

    return novedad;
  }
}