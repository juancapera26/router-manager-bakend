// paquetes.service.ts
import {Injectable} from '@nestjs/common';
import {PrismaService} from 'prisma/prisma.service';
//import {CreatePaqueteDto} from './dto/create-paquete.dto';
import {UpdatePaqueteDto} from '../interface/controllers/dto/update-paquete.dto';

@Injectable()
export class PaquetesService {
  constructor(private prisma: PrismaService) {}

  getAll() {
    return this.prisma.paquete.findMany();
  }

  getOne(id: number) {
    return this.prisma.paquete.findUnique({where: {id_paquete: id}});
  }

  // create(data: CreatePaqueteDto) {
  //   return this.prisma.paquete.create({data});
  // }

  update(id: number, data: UpdatePaqueteDto) {
    return this.prisma.paquete.update({
      where: {id_paquete: id},
      data
    });
  }
  delete(id: number) {
    return this.prisma.paquete.delete({where: {id_paquete: id}});
  }
}
