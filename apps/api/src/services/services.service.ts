import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { FilterServiceDto } from './dto/filter-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filter: FilterServiceDto) {
    const where: Prisma.ServiceWhereInput = {};

    if (filter.status) {
      where.status = filter.status;
    } else {
      where.status = 'APPROVED';
      where.isActive = true;
    }
    if (filter.category) where.category = filter.category;
    if (filter.search) {
      where.OR = [
        { titleRo: { contains: filter.search, mode: 'insensitive' } },
        { titleEn: { contains: filter.search, mode: 'insensitive' } },
        { descriptionRo: { contains: filter.search, mode: 'insensitive' } },
        { descriptionEn: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    const page = filter.page ?? 1;
    const limit = filter.limit ?? 12;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.service.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }

  async findByOwner(ownerId: string, filter: FilterServiceDto) {
    const page = filter.page ?? 1;
    const limit = filter.limit ?? 12;
    const skip = (page - 1) * limit;

    const where: Prisma.ServiceWhereInput = { ownerId };
    if (filter.status) where.status = filter.status;

    const [data, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.service.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(ownerId: string, dto: CreateServiceDto) {
    return this.prisma.service.create({
      data: {
        ...dto,
        ownerId,
        status: 'PENDING',
      },
    });
  }

  async update(id: string, ownerId: string, dto: UpdateServiceDto) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    if (service.ownerId !== ownerId) {
      throw new ForbiddenException('You can only edit your own services');
    }

    return this.prisma.service.update({
      where: { id },
      data: {
        ...dto,
        status: 'PENDING',
      },
    });
  }

  async delete(id: string, ownerId: string) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    if (service.ownerId !== ownerId) {
      throw new ForbiddenException('You can only delete your own services');
    }
    await this.prisma.service.delete({ where: { id } });
    return { message: 'Service deleted' };
  }

  async getFeatured() {
    return this.prisma.service.findMany({
      where: { status: 'APPROVED', isActive: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPromoted() {
    return this.prisma.service.findMany({
      where: {
        status: 'APPROVED',
        isActive: true,
        promotionOrder: { not: null },
      },
      orderBy: { promotionOrder: 'asc' },
      take: 3,
    });
  }
}
