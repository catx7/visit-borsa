import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceCategory } from '@prisma/client';
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

export class CreateServiceDto {
  @ApiProperty({ enum: ServiceCategory })
  @IsEnum(ServiceCategory)
  category: ServiceCategory;

  @ApiProperty({ example: 'Plimbări cu ATV-ul' })
  @IsString()
  @MinLength(3)
  titleRo: string;

  @ApiProperty({ example: 'ATV Rides' })
  @IsString()
  @MinLength(3)
  titleEn: string;

  @ApiProperty({ example: 'Oferim plimbări cu ATV-ul prin munți...' })
  @IsString()
  @MinLength(10)
  descriptionRo: string;

  @ApiProperty({ example: 'We offer ATV rides through the mountains...' })
  @IsString()
  @MinLength(10)
  descriptionEn: string;

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

  @ApiPropertyOptional({ example: 'contact@atv-rides.ro' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'https://atv-rides.ro' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ example: 'Str. Muntelui 12, Brașov' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'De la 150 RON/persoană' })
  @IsOptional()
  @IsString()
  priceInfo?: string;

  @ApiPropertyOptional({ example: 45.5945 })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 25.5564 })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}
