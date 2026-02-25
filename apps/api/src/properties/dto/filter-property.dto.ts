import { ApiPropertyOptional } from '@nestjs/swagger';
import { PropertyType, PropertyStatus } from '@prisma/client';
import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/pagination.dto';

export class FilterPropertyDto extends PaginationDto {
  @ApiPropertyOptional({ enum: PropertyType })
  @IsOptional()
  @IsEnum(PropertyType)
  type?: PropertyType;

  @ApiPropertyOptional({ enum: PropertyStatus })
  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ['room', 'whole_unit'] })
  @IsOptional()
  @IsString()
  rentalType?: string;

  @ApiPropertyOptional({ enum: ['price', 'name', 'capacity', 'createdAt'] })
  @IsOptional()
  @IsIn(['price', 'name', 'capacity', 'createdAt'])
  sortBy?: string;

  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: string;
}
