import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { FilterRestaurantDto } from './dto/filter-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async findAll(filter: FilterRestaurantDto) {
    const where: Prisma.RestaurantWhereInput = {};

    if (filter.status) {
      where.status = filter.status;
    } else {
      where.status = 'APPROVED';
    }
    if (where.status === 'APPROVED') {
      where.isActive = true;
    }
    if (filter.priceRange) {
      where.priceRange = filter.priceRange;
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
      this.prisma.restaurant.findMany({
        where,
        skip,
        take: limit,
        orderBy: (() => {
          const orderBy: any[] = [
            { promotionOrder: { sort: 'asc', nulls: 'last' } },
          ];
          const sortOrder = filter.sortOrder === 'asc' ? 'asc' : 'desc';
          if (filter.sortBy === 'name') {
            orderBy.push({ titleRo: sortOrder });
          } else {
            orderBy.push({ createdAt: 'desc' });
          }
          return orderBy;
        })(),
      }),
      this.prisma.restaurant.count({ where }),
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
    const restaurant = await this.prisma.restaurant.findUnique({
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
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    return restaurant;
  }

  async findByOwner(ownerId: string, filter: FilterRestaurantDto) {
    const page = filter.page ?? 1;
    const limit = filter.limit ?? 12;
    const skip = (page - 1) * limit;

    const where: Prisma.RestaurantWhereInput = { ownerId };
    if (filter.status) where.status = filter.status;

    const [data, total] = await Promise.all([
      this.prisma.restaurant.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.restaurant.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(ownerId: string, dto: CreateRestaurantDto) {
    return this.prisma.restaurant.create({
      data: {
        ...dto,
        ownerId,
        status: 'PENDING',
      },
    });
  }

  async update(id: string, ownerId: string, dto: UpdateRestaurantDto) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
    });
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    if (restaurant.ownerId !== ownerId) {
      throw new ForbiddenException('You can only edit your own restaurants');
    }
    if (dto.images !== undefined && dto.images.length === 0) {
      throw new BadRequestException('At least one image is required');
    }

    return this.prisma.restaurant.update({
      where: { id },
      data: {
        ...dto,
        status: 'PENDING',
      },
    });
  }

  async delete(id: string, ownerId: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
    });
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    if (restaurant.ownerId !== ownerId) {
      throw new ForbiddenException('You can only delete your own restaurants');
    }
    await this.prisma.restaurant.delete({ where: { id } });
    this.uploadService.deleteImages(restaurant.images).catch(() => {});
    return { message: 'Restaurant deleted' };
  }

  async getFeatured() {
    return this.prisma.restaurant.findMany({
      where: { status: 'APPROVED', isActive: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPromoted() {
    return this.prisma.restaurant.findMany({
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
