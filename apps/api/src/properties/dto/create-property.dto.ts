import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PropertyType } from '@prisma/client';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreatePropertyDto {
  @ApiProperty({ enum: PropertyType })
  @IsEnum(PropertyType)
  type: PropertyType;

  @ApiProperty({ example: 'Pensiune Borșa' })
  @IsString()
  @MinLength(3)
  titleRo: string;

  @ApiProperty({ example: 'Borsa Guesthouse' })
  @IsString()
  @MinLength(3)
  titleEn: string;

  @ApiProperty({ example: 'O pensiune superbă în Borșa...' })
  @IsString()
  @MinLength(10)
  descriptionRo: string;

  @ApiProperty({ example: 'A beautiful guesthouse in Borsa...' })
  @IsString()
  @MinLength(10)
  descriptionEn: string;

  @ApiPropertyOptional({ example: 'Strada Principală 10, Borșa' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 47.6529 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 24.6639 })
  @IsNumber()
  longitude: number;

  @ApiProperty({ example: 250 })
  @IsNumber()
  @Min(0)
  pricePerNight: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(8)
  @IsString({ each: true })
  images: string[] = [];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities: string[] = [];

  @ApiPropertyOptional({ example: 4 })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxGuests: number = 2;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  @Min(1)
  rooms: number = 1;
}
