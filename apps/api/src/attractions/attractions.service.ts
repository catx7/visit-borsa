import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/pagination.dto';

@Injectable()
export class AttractionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(pagination: PaginationDto) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 12;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.touristAttraction.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.touristAttraction.count(),
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
    const attraction = await this.prisma.touristAttraction.findUnique({
      where: { id },
    });
    if (!attraction) {
      throw new NotFoundException('Attraction not found');
    }
    return attraction;
  }

  async findNearby(latitude: number, longitude: number, radiusKm: number = 50) {
    const attractions = await this.prisma.touristAttraction.findMany();

    return attractions
      .map((a) => ({
        ...a,
        distance: this.haversineDistance(latitude, longitude, a.latitude, a.longitude),
      }))
      .filter((a) => a.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10);
  }

  async getFeatured() {
    return this.prisma.touristAttraction.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getLocationOfMonth(): Promise<{ type: string; entity: any } | null> {
    const [property, service, restaurant, attraction] = await Promise.all([
      this.prisma.property.findFirst({ where: { isLocationOfMonth: true, status: 'APPROVED', isActive: true } }),
      this.prisma.service.findFirst({ where: { isLocationOfMonth: true, status: 'APPROVED', isActive: true } }),
      this.prisma.restaurant.findFirst({ where: { isLocationOfMonth: true, status: 'APPROVED', isActive: true } }),
      this.prisma.touristAttraction.findFirst({ where: { isLocationOfMonth: true } }),
    ]);

    if (property) return { type: 'PROPERTY', entity: property };
    if (service) return { type: 'SERVICE', entity: service };
    if (restaurant) return { type: 'RESTAURANT', entity: restaurant };
    if (attraction) return { type: 'ATTRACTION', entity: attraction };
    return null;
  }

  private haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
