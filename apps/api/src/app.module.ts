import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PropertiesModule } from './properties/properties.module';
import { AttractionsModule } from './attractions/attractions.module';
import { ServicesModule } from './services/services.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { UploadModule } from './upload/upload.module';
import { AdminModule } from './admin/admin.module';
import { ContactClicksModule } from './contact-clicks/contact-clicks.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PropertiesModule,
    AttractionsModule,
    ServicesModule,
    RestaurantsModule,
    UploadModule,
    AdminModule,
    ContactClicksModule,
  ],
})
export class AppModule {}
