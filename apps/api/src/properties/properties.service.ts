import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { FilterPropertyDto } from './dto/filter-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async findAll(filter: FilterPropertyDto) {
    const where: Prisma.PropertyWhereInput = {};

    if (filter.type) where.type = filter.type;
    if (filter.status) {
      where.status = filter.status;
    } else {
      where.status = 'APPROVED';
    }
    if (where.status === 'APPROVED') {
      where.isActive = true;
    }
    if (filter.rentalType === 'whole_unit') {
      where.priceWholeUnit = { not: null };
    }
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
      this.prisma.property.findMany({
        where,
        include: {
          owner: {
            select: { id: true, firstName: true, lastName: true, phone: true },
          },
        },
        skip,
        take: limit,
        orderBy: (() => {
          const orderBy: any[] = [
            { promotionOrder: { sort: 'asc', nulls: 'last' } },
          ];
          const sortOrder = filter.sortOrder === 'asc' ? 'asc' : 'desc';
          if (filter.sortBy === 'price') {
            const priceField = filter.rentalType === 'whole_unit' ? 'priceWholeUnit' : 'pricePerNight';
            orderBy.push({ [priceField]: sortOrder });
          } else if (filter.sortBy === 'name') {
            orderBy.push({ titleRo: sortOrder });
          } else if (filter.sortBy === 'capacity') {
            orderBy.push({ maxGuests: sortOrder });
          } else {
            orderBy.push({ createdAt: 'desc' });
          }
          return orderBy;
        })(),
      }),
      this.prisma.property.count({ where }),
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
    const property = await this.prisma.property.findUnique({
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
    if (!property) {
      throw new NotFoundException('Property not found');
    }
    return property;
  }

  async findByOwner(ownerId: string, filter: FilterPropertyDto) {
    const page = filter.page ?? 1;
    const limit = filter.limit ?? 12;
    const skip = (page - 1) * limit;

    const where: Prisma.PropertyWhereInput = { ownerId };
    if (filter.status) where.status = filter.status;

    const [data, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.property.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(ownerId: string, dto: CreatePropertyDto) {
    return this.prisma.property.create({
      data: {
        ...dto,
        ownerId,
        status: 'PENDING',
      },
    });
  }

  async update(id: string, ownerId: string, dto: UpdatePropertyDto) {
    const property = await this.prisma.property.findUnique({ where: { id } });
    if (!property) {
      throw new NotFoundException('Property not found');
    }
    if (property.ownerId !== ownerId) {
      throw new ForbiddenException('You can only edit your own properties');
    }
    if (dto.images !== undefined && dto.images.length === 0) {
      throw new BadRequestException('At least one image is required');
    }

    return this.prisma.property.update({
      where: { id },
      data: {
        ...dto,
        status: 'PENDING',
      },
    });
  }

  async delete(id: string, ownerId: string) {
    const property = await this.prisma.property.findUnique({ where: { id } });
    if (!property) {
      throw new NotFoundException('Property not found');
    }
    if (property.ownerId !== ownerId) {
      throw new ForbiddenException('You can only delete your own properties');
    }
    await this.prisma.property.delete({ where: { id } });
    this.uploadService.deleteImages(property.images).catch(() => {});
    return { message: 'Property deleted' };
  }

  async getFeatured() {
    return this.prisma.property.findMany({
      where: { status: 'APPROVED', isActive: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPromoted() {
    return this.prisma.property.findMany({
      where: {
        status: 'APPROVED',
        isActive: true,
        promotionOrder: { not: null },
      },
      include: {
        owner: {
          select: { id: true, firstName: true, lastName: true, phone: true },
        },
      },
      orderBy: { promotionOrder: 'asc' },
      take: 3,
    });
  }
}
