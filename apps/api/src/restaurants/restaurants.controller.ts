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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../auth/decorators/current-user.decorator';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { FilterRestaurantDto } from './dto/filter-restaurant.dto';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  @ApiOperation({ summary: 'Get restaurants with filters and pagination' })
  @ApiResponse({ status: 200, description: 'Paginated list of restaurants' })
  findAll(@Query() filter: FilterRestaurantDto) {
    return this.restaurantsService.findAll(filter);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured restaurants' })
  @ApiResponse({ status: 200, description: 'List of featured restaurants' })
  getFeatured() {
    return this.restaurantsService.getFeatured();
  }

  @Get('promoted')
  @ApiOperation({ summary: 'Get top 3 promoted restaurants' })
  @ApiResponse({ status: 200, description: 'List of promoted restaurants' })
  getPromoted() {
    return this.restaurantsService.getPromoted();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user restaurants' })
  findByOwner(
    @CurrentUser() user: CurrentUserPayload,
    @Query() filter: FilterRestaurantDto,
  ) {
    return this.restaurantsService.findByOwner(user.id, filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get restaurant by ID' })
  @ApiResponse({ status: 200, description: 'Restaurant details' })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  findById(@Param('id') id: string) {
    return this.restaurantsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new restaurant' })
  @ApiResponse({ status: 201, description: 'Restaurant created' })
  create(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateRestaurantDto,
  ) {
    return this.restaurantsService.create(user.id, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a restaurant' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: UpdateRestaurantDto,
  ) {
    return this.restaurantsService.update(id, user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a restaurant' })
  delete(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.restaurantsService.delete(id, user.id);
  }
}
