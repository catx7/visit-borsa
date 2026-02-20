import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/guards/roles.guard';
import { AdminService } from './admin.service';
import { UpdatePropertyStatusDto } from './dto/update-property-status.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { FilterPropertyDto } from '../properties/dto/filter-property.dto';
import { PaginationDto } from '../common/pagination.dto';
import { CreateAttractionDto } from '../attractions/dto/create-attraction.dto';
import { UpdateAttractionDto } from '../attractions/dto/update-attraction.dto';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get admin dashboard statistics' })
  getStats() {
    return this.adminService.getStats();
  }

  // --- Properties ---
  @Get('properties')
  @ApiOperation({ summary: 'Get all properties (admin)' })
  getAllProperties(@Query() filter: FilterPropertyDto) {
    return this.adminService.getAllProperties(filter);
  }

  @Patch('properties/:id/status')
  @ApiOperation({ summary: 'Update property status (approve/reject)' })
  updatePropertyStatus(
    @Param('id') id: string,
    @Body() dto: UpdatePropertyStatusDto,
  ) {
    return this.adminService.updatePropertyStatus(id, dto);
  }

  @Patch('properties/:id/toggle-active')
  @ApiOperation({ summary: 'Toggle property active status (subscription)' })
  togglePropertyActive(@Param('id') id: string) {
    return this.adminService.togglePropertyActive(id);
  }

  @Delete('properties/:id')
  @ApiOperation({ summary: 'Delete a property' })
  deleteProperty(@Param('id') id: string) {
    return this.adminService.deleteProperty(id);
  }

  // --- Services ---
  @Get('services')
  @ApiOperation({ summary: 'Get all services (admin)' })
  getAllServices(@Query() pagination: PaginationDto) {
    return this.adminService.getAllServices(pagination);
  }

  @Patch('services/:id/status')
  @ApiOperation({ summary: 'Update service status (approve/reject)' })
  updateServiceStatus(
    @Param('id') id: string,
    @Body() dto: UpdatePropertyStatusDto,
  ) {
    return this.adminService.updateServiceStatus(id, dto);
  }

  @Patch('services/:id/toggle-active')
  @ApiOperation({ summary: 'Toggle service active status (subscription)' })
  toggleServiceActive(@Param('id') id: string) {
    return this.adminService.toggleServiceActive(id);
  }

  @Delete('services/:id')
  @ApiOperation({ summary: 'Delete a service' })
  deleteService(@Param('id') id: string) {
    return this.adminService.deleteService(id);
  }

  // --- Restaurants ---
  @Get('restaurants')
  @ApiOperation({ summary: 'Get all restaurants (admin)' })
  getAllRestaurants(@Query() pagination: PaginationDto) {
    return this.adminService.getAllRestaurants(pagination);
  }

  @Patch('restaurants/:id/status')
  @ApiOperation({ summary: 'Update restaurant status (approve/reject)' })
  updateRestaurantStatus(
    @Param('id') id: string,
    @Body() dto: UpdatePropertyStatusDto,
  ) {
    return this.adminService.updateRestaurantStatus(id, dto);
  }

  @Patch('restaurants/:id/toggle-active')
  @ApiOperation({ summary: 'Toggle restaurant active status (subscription)' })
  toggleRestaurantActive(@Param('id') id: string) {
    return this.adminService.toggleRestaurantActive(id);
  }

  @Delete('restaurants/:id')
  @ApiOperation({ summary: 'Delete a restaurant' })
  deleteRestaurant(@Param('id') id: string) {
    return this.adminService.deleteRestaurant(id);
  }

  // --- Users ---
  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  getAllUsers(@Query() pagination: PaginationDto) {
    return this.adminService.getAllUsers(pagination);
  }

  @Patch('users/:id')
  @ApiOperation({ summary: 'Update user role' })
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserRoleDto) {
    return this.adminService.updateUser(id, dto);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete a user' })
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // --- Attractions ---
  @Post('attractions')
  @ApiOperation({ summary: 'Create a tourist attraction' })
  createAttraction(@Body() dto: CreateAttractionDto) {
    return this.adminService.createAttraction(dto);
  }

  @Patch('attractions/:id')
  @ApiOperation({ summary: 'Update a tourist attraction' })
  updateAttraction(@Param('id') id: string, @Body() dto: UpdateAttractionDto) {
    return this.adminService.updateAttraction(id, dto);
  }

  @Delete('attractions/:id')
  @ApiOperation({ summary: 'Delete a tourist attraction' })
  deleteAttraction(@Param('id') id: string) {
    return this.adminService.deleteAttraction(id);
  }

  // --- Promoted & Location of Month ---
  @Post('promoted')
  @ApiOperation({ summary: 'Set top 3 promoted properties' })
  setPromotedProperties(@Body() body: { propertyIds: string[] }) {
    return this.adminService.setPromotedProperties(body.propertyIds);
  }

  @Post('promoted-services')
  @ApiOperation({ summary: 'Set top 3 promoted services' })
  setPromotedServices(@Body() body: { serviceIds: string[] }) {
    return this.adminService.setPromotedServices(body.serviceIds);
  }

  @Post('promoted-restaurants')
  @ApiOperation({ summary: 'Set top 3 promoted restaurants' })
  setPromotedRestaurants(@Body() body: { restaurantIds: string[] }) {
    return this.adminService.setPromotedRestaurants(body.restaurantIds);
  }

  @Get('location-of-month')
  @ApiOperation({ summary: 'Get location of the month' })
  getLocationOfMonth() {
    return this.adminService.getLocationOfMonth();
  }

  @Post('location-of-month')
  @ApiOperation({ summary: 'Set location of the month (any entity type)' })
  setLocationOfMonth(@Body() body: { entityType: string; entityId: string }) {
    return this.adminService.setLocationOfMonth(body.entityType, body.entityId);
  }
}
