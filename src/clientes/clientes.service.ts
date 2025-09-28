import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructure/persistence/prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateClienteDto) {
    return this.prisma.cliente.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.cliente.findMany();
  }

  async findOne(id: number) {
    return this.prisma.cliente.findUnique({
      where: { id_cliente: id },
    });
  }
}
