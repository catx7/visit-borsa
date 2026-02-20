import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PriceRange } from '@prisma/client';
import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({ example: 'Restaurant La Conac' })
  @IsString()
  @MinLength(3)
  titleRo: string;

  @ApiProperty({ example: 'The Manor Restaurant' })
  @IsString()
  @MinLength(3)
  titleEn: string;

  @ApiProperty({ example: 'Un restaurant tradițional cu specific românesc...' })
  @IsString()
  @MinLength(10)
  descriptionRo: string;

  @ApiProperty({ example: 'A traditional Romanian restaurant with local cuisine...' })
  @IsString()
  @MinLength(10)
  descriptionEn: string;

  @ApiPropertyOptional({ example: 'Bucătărie tradițională românească' })
  @IsOptional()
  @IsString()
  cuisineRo?: string;

  @ApiPropertyOptional({ example: 'Traditional Romanian cuisine' })
  @IsOptional()
  @IsString()
  cuisineEn?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(8)
  @IsString({ each: true })
  images: string[] = [];

  @ApiPropertyOptional({ example: '+40 721 000 000' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'contact@restaurant.ro' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'https://restaurant.ro' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ example: 'Str. Principală nr. 1, Brașov' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ enum: PriceRange })
  @IsOptional()
  @IsEnum(PriceRange)
  priceRange?: PriceRange;

  @ApiPropertyOptional({ example: 'Luni-Vineri: 10:00-22:00' })
  @IsOptional()
  @IsString()
  openingHours?: string;

  @ApiPropertyOptional({ example: 45.5945 })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 25.5564 })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}
