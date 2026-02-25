import { IsEnum, IsString } from 'class-validator';
import type { EntityType, ContactType } from '@prisma/client';

export class CreateContactClickDto {
  @IsEnum({ PROPERTY: 'PROPERTY', SERVICE: 'SERVICE', RESTAURANT: 'RESTAURANT' })
  entityType: EntityType;

  @IsString()
  entityId: string;

  @IsEnum({
    PHONE: 'PHONE',
    EMAIL: 'EMAIL',
    WEBSITE: 'WEBSITE',
    WHATSAPP: 'WHATSAPP',
  })
  contactType: ContactType;
}
