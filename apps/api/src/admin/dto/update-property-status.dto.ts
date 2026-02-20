import { ApiProperty } from '@nestjs/swagger';
import { PropertyStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdatePropertyStatusDto {
  @ApiProperty({ enum: PropertyStatus })
  @IsEnum(PropertyStatus)
  status: PropertyStatus;
}
