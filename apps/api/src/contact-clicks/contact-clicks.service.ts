import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactClickDto } from './dto/create-contact-click.dto';

@Injectable()
export class ContactClicksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateContactClickDto) {
    return this.prisma.contactClick.create({ data: dto });
  }

  async getOverallStats() {
    const [total, byType, byEntity] = await Promise.all([
      this.prisma.contactClick.count(),
      this.prisma.contactClick.groupBy({
        by: ['contactType'],
        _count: true,
      }),
      this.prisma.contactClick.groupBy({
        by: ['entityType'],
        _count: true,
      }),
    ]);

    return { total, byType, byEntity };
  }

  async getStatsByEntity(entityType: string, entityId: string) {
    const clicks = await this.prisma.contactClick.groupBy({
      by: ['contactType'],
      where: {
        entityType: entityType as any,
        entityId,
      },
      _count: true,
    });

    return clicks;
  }
}
