import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePropertyStatusDto } from './dto/update-property-status.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { FilterPropertyDto } from '../properties/dto/filter-property.dto';
import { PaginationDto } from '../common/pagination.dto';
import { CreateAttractionDto } from '../attractions/dto/create-attraction.dto';
import { UpdateAttractionDto } from '../attractions/dto/update-attraction.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [
      totalUsers,
      totalProperties,
      pendingProperties,
      totalServices,
      pendingServices,
      totalRestaurants,
      pendingRestaurants,
      totalAttractions,
      totalContactClicks,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.property.count(),
      this.prisma.property.count({ where: { status: 'PENDING' } }),
      this.prisma.service.count(),
      this.prisma.service.count({ where: { status: 'PENDING' } }),
      this.prisma.restaurant.count(),
      this.prisma.restaurant.count({ where: { status: 'PENDING' } }),
      this.prisma.touristAttraction.count(),
      this.prisma.contactClick.count(),
    ]);

    return {
      totalUsers,
      totalProperties,
      pendingProperties,
      totalServices,
      pendingServices,
      totalRestaurants,
      pendingRestaurants,
      totalAttractions,
      totalContactClicks,
    };
  }

  // --- Properties ---
  async getAllProperties(filter: FilterPropertyDto) {
    const page = filter.page ?? 1;
    const limit = filter.limit ?? 12;
    const skip = (page - 1) * limit;

    const where: Prisma.PropertyWhereInput = {};
    if (filter.status) where.status = filter.status;
    if (filter.type) where.type = filter.type;
    if (filter.search) {
      where.OR = [
        { titleRo: { contains: filter.search, mode: 'insensitive' } },
        { titleEn: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        include: {
          owner: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.property.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updatePropertyStatus(id: string, dto: UpdatePropertyStatusDto) {
    const property = await this.prisma.property.findUnique({ where: { id } });
    if (!property) {
      throw new NotFoundException('Property not found');
    }
    return this.prisma.property.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async togglePropertyActive(id: string) {
    const property = await this.prisma.property.findUnique({ where: { id } });
    if (!property) throw new NotFoundException('Property not found');
    return this.prisma.property.update({
      where: { id },
      data: { isActive: !property.isActive },
    });
  }

  async deleteProperty(id: string) {
    const property = await this.prisma.property.findUnique({ where: { id } });
    if (!property) {
      throw new NotFoundException('Property not found');
    }
    await this.prisma.property.delete({ where: { id } });
    return { message: 'Property deleted' };
  }

  // --- Services ---
  async getAllServices(pagination: PaginationDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 12;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.service.findMany({
        include: {
          owner: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.service.count(),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateServiceStatus(id: string, dto: UpdatePropertyStatusDto) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return this.prisma.service.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async toggleServiceActive(id: string) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) throw new NotFoundException('Service not found');
    return this.prisma.service.update({
      where: { id },
      data: { isActive: !service.isActive },
    });
  }

  async deleteService(id: string) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    await this.prisma.service.delete({ where: { id } });
    return { message: 'Service deleted' };
  }

  // --- Restaurants ---
  async getAllRestaurants(pagination: PaginationDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 12;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.restaurant.findMany({
        include: {
          owner: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.restaurant.count(),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateRestaurantStatus(id: string, dto: UpdatePropertyStatusDto) {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { id } });
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    return this.prisma.restaurant.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async toggleRestaurantActive(id: string) {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { id } });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return this.prisma.restaurant.update({
      where: { id },
      data: { isActive: !restaurant.isActive },
    });
  }

  async deleteRestaurant(id: string) {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { id } });
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    await this.prisma.restaurant.delete({ where: { id } });
    return { message: 'Restaurant deleted' };
  }

  // --- Users ---
  async getAllUsers(pagination: PaginationDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 12;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          role: true,
          emailConfirmed: true,
          firstName: true,
          lastName: true,
          phone: true,
          createdAt: true,
          _count: { select: { properties: true, services: true, restaurants: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateUser(id: string, dto: UpdateUserRoleDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        email: true,
        role: true,
        emailConfirmed: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted' };
  }

  // --- Attractions ---
  async createAttraction(dto: CreateAttractionDto) {
    return this.prisma.touristAttraction.create({ data: dto });
  }

  async updateAttraction(id: string, dto: UpdateAttractionDto) {
    const attraction = await this.prisma.touristAttraction.findUnique({ where: { id } });
    if (!attraction) {
      throw new NotFoundException('Attraction not found');
    }
    return this.prisma.touristAttraction.update({
      where: { id },
      data: dto,
    });
  }

  async deleteAttraction(id: string) {
    const attraction = await this.prisma.touristAttraction.findUnique({ where: { id } });
    if (!attraction) {
      throw new NotFoundException('Attraction not found');
    }
    await this.prisma.touristAttraction.delete({ where: { id } });
    return { message: 'Attraction deleted' };
  }

  // --- Promoted & Location of Month ---
  async setPromotedProperties(ids: string[]) {
    if (ids.length > 3) {
      throw new BadRequestException('Maximum 3 promoted properties allowed');
    }

    // Verify all properties exist and are APPROVED
    const properties = await this.prisma.property.findMany({
      where: { id: { in: ids }, status: 'APPROVED' },
    });
    if (properties.length !== ids.length) {
      throw new BadRequestException('All properties must exist and be approved');
    }

    // Clear existing promotions
    await this.prisma.property.updateMany({
      where: { promotionOrder: { not: null } },
      data: { promotionOrder: null },
    });

    // Set new promotions
    for (let i = 0; i < ids.length; i++) {
      await this.prisma.property.update({
        where: { id: ids[i] },
        data: { promotionOrder: i + 1 },
      });
    }

    return { message: 'Promoted properties updated', count: ids.length };
  }

  async setPromotedServices(ids: string[]) {
    if (ids.length > 3) {
      throw new BadRequestException('Maximum 3 promoted services allowed');
    }

    const services = await this.prisma.service.findMany({
      where: { id: { in: ids }, status: 'APPROVED' },
    });
    if (services.length !== ids.length) {
      throw new BadRequestException('All services must exist and be approved');
    }

    await this.prisma.service.updateMany({
      where: { promotionOrder: { not: null } },
      data: { promotionOrder: null },
    });

    for (let i = 0; i < ids.length; i++) {
      await this.prisma.service.update({
        where: { id: ids[i] },
        data: { promotionOrder: i + 1 },
      });
    }

    return { message: 'Promoted services updated', count: ids.length };
  }

  async setPromotedRestaurants(ids: string[]) {
    if (ids.length > 3) {
      throw new BadRequestException('Maximum 3 promoted restaurants allowed');
    }

    const restaurants = await this.prisma.restaurant.findMany({
      where: { id: { in: ids }, status: 'APPROVED' },
    });
    if (restaurants.length !== ids.length) {
      throw new BadRequestException('All restaurants must exist and be approved');
    }

    await this.prisma.restaurant.updateMany({
      where: { promotionOrder: { not: null } },
      data: { promotionOrder: null },
    });

    for (let i = 0; i < ids.length; i++) {
      await this.prisma.restaurant.update({
        where: { id: ids[i] },
        data: { promotionOrder: i + 1 },
      });
    }

    return { message: 'Promoted restaurants updated', count: ids.length };
  }

  async setLocationOfMonth(entityType: string, entityId: string) {
    switch (entityType) {
      case 'PROPERTY': {
        const p = await this.prisma.property.findUnique({ where: { id: entityId } });
        if (!p) throw new NotFoundException('Property not found');
        break;
      }
      case 'SERVICE': {
        const s = await this.prisma.service.findUnique({ where: { id: entityId } });
        if (!s) throw new NotFoundException('Service not found');
        break;
      }
      case 'RESTAURANT': {
        const r = await this.prisma.restaurant.findUnique({ where: { id: entityId } });
        if (!r) throw new NotFoundException('Restaurant not found');
        break;
      }
      case 'ATTRACTION': {
        const a = await this.prisma.touristAttraction.findUnique({ where: { id: entityId } });
        if (!a) throw new NotFoundException('Attraction not found');
        break;
      }
      default:
        throw new BadRequestException('Invalid entity type');
    }

    // Clear all isLocationOfMonth across all tables
    await Promise.all([
      this.prisma.property.updateMany({ where: { isLocationOfMonth: true }, data: { isLocationOfMonth: false } }),
      this.prisma.service.updateMany({ where: { isLocationOfMonth: true }, data: { isLocationOfMonth: false } }),
      this.prisma.restaurant.updateMany({ where: { isLocationOfMonth: true }, data: { isLocationOfMonth: false } }),
      this.prisma.touristAttraction.updateMany({ where: { isLocationOfMonth: true }, data: { isLocationOfMonth: false } }),
    ]);

    // Set the new location of month
    switch (entityType) {
      case 'PROPERTY':
        return { type: 'PROPERTY', entity: await this.prisma.property.update({ where: { id: entityId }, data: { isLocationOfMonth: true } }) };
      case 'SERVICE':
        return { type: 'SERVICE', entity: await this.prisma.service.update({ where: { id: entityId }, data: { isLocationOfMonth: true } }) };
      case 'RESTAURANT':
        return { type: 'RESTAURANT', entity: await this.prisma.restaurant.update({ where: { id: entityId }, data: { isLocationOfMonth: true } }) };
      case 'ATTRACTION':
        return { type: 'ATTRACTION', entity: await this.prisma.touristAttraction.update({ where: { id: entityId }, data: { isLocationOfMonth: true } }) };
    }
  }

  async getLocationOfMonth(): Promise<{ type: string; entity: any } | null> {
    const [property, service, restaurant, attraction] = await Promise.all([
      this.prisma.property.findFirst({ where: { isLocationOfMonth: true } }),
      this.prisma.service.findFirst({ where: { isLocationOfMonth: true } }),
      this.prisma.restaurant.findFirst({ where: { isLocationOfMonth: true } }),
      this.prisma.touristAttraction.findFirst({ where: { isLocationOfMonth: true } }),
    ]);

    if (property) return { type: 'PROPERTY', entity: property };
    if (service) return { type: 'SERVICE', entity: service };
    if (restaurant) return { type: 'RESTAURANT', entity: restaurant };
    if (attraction) return { type: 'ATTRACTION', entity: attraction };
    return null;
  }
}
