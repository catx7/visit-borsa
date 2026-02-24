import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ContactClicksService } from './contact-clicks.service';
import { CreateContactClickDto } from './dto/create-contact-click.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/contact-clicks')
export class ContactClicksController {
  constructor(private readonly service: ContactClicksService) {}

  @Post()
  create(@Body() dto: CreateContactClickDto) {
    return this.service.create(dto);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getOverallStats() {
    return this.service.getOverallStats();
  }

  @Get('stats/:entityType/:entityId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getStatsByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.service.getStatsByEntity(entityType, entityId);
  }
}
