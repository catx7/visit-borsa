import { ApiPropertyOptional } from '@nestjs/swagger';
import { PriceRange, PropertyStatus } from '@prisma/client';
import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/pagination.dto';

export class FilterRestaurantDto extends PaginationDto {
  @ApiPropertyOptional({ enum: PriceRange })
  @IsOptional()
  @IsEnum(PriceRange)
  priceRange?: PriceRange;

  @ApiPropertyOptional({ enum: PropertyStatus })
  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ['name', 'createdAt'] })
  @IsOptional()
  @IsIn(['name', 'createdAt'])
  sortBy?: string;

  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: string;
}
