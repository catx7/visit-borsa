import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Ion' })
  @IsString()
  @MinLength(1)
  firstName: string;

  @ApiProperty({ example: 'Popescu' })
  @IsString()
  @MinLength(1)
  lastName: string;

  @ApiPropertyOptional({ example: '+40712345678' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Google reCAPTCHA v2 token' })
  @IsString()
  captchaToken: string;
}
