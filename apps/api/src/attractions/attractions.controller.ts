import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AttractionsService } from './attractions.service';
import { PaginationDto } from '../common/pagination.dto';

@ApiTags('Attractions')
@Controller('attractions')
export class AttractionsController {
  constructor(private readonly attractionsService: AttractionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tourist attractions' })
  @ApiResponse({ status: 200, description: 'Paginated list of attractions' })
  findAll(@Query() pagination: PaginationDto) {
    return this.attractionsService.findAll(pagination);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured attractions' })
  getFeatured() {
    return this.attractionsService.getFeatured();
  }

  @Get('location-of-month')
  @ApiOperation({ summary: 'Get the location of the month' })
  getLocationOfMonth() {
    return this.attractionsService.getLocationOfMonth();
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Get nearby attractions by coordinates' })
  @ApiQuery({ name: 'lat', type: Number })
  @ApiQuery({ name: 'lng', type: Number })
  @ApiQuery({ name: 'radius', type: Number, required: false })
  findNearby(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string,
  ) {
    return this.attractionsService.findNearby(
      parseFloat(lat),
      parseFloat(lng),
      radius ? parseFloat(radius) : 50,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get attraction by ID' })
  @ApiResponse({ status: 200, description: 'Attraction details' })
  @ApiResponse({ status: 404, description: 'Attraction not found' })
  findById(@Param('id') id: string) {
    return this.attractionsService.findById(id);
  }
}
