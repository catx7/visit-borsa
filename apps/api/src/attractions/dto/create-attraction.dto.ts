import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateAttractionDto {
  @ApiProperty({ example: 'Cascada Cailor' })
  @IsString()
  @MinLength(3)
  titleRo: string;

  @ApiProperty({ example: 'Horses Waterfall' })
  @IsString()
  @MinLength(3)
  titleEn: string;

  @ApiProperty({ example: 'Cea mai înaltă cascadă din România...' })
  @IsString()
  @MinLength(10)
  descriptionRo: string;

  @ApiProperty({ example: 'The tallest waterfall in Romania...' })
  @IsString()
  @MinLength(10)
  descriptionEn: string;

  @ApiProperty({ example: 47.6519 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 24.7833 })
  @IsNumber()
  longitude: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images: string[] = [];
}
