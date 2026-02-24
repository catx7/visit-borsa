import { Module } from '@nestjs/common';
import { ContactClicksController } from './contact-clicks.controller';
import { ContactClicksService } from './contact-clicks.service';

@Module({
  controllers: [ContactClicksController],
  providers: [ContactClicksService],
  exports: [ContactClicksService],
})
export class ContactClicksModule {}
