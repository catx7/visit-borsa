export enum Role {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
}

export enum PropertyType {
  HOTEL = 'HOTEL',
  VILA = 'VILA',
  PENSIUNE = 'PENSIUNE',
  CABANA = 'CABANA',
  APARTAMENT = 'APARTAMENT',
  CAMERA = 'CAMERA',
  CASA_VACANTA = 'CASA_VACANTA',
}

export enum PropertyStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

export enum ServiceCategory {
  ATV = 'ATV',
  SNOWMOBILE = 'SNOWMOBILE',
  HORSEBACK_RIDING = 'HORSEBACK_RIDING',
  HIKING = 'HIKING',
  SKIING = 'SKIING',
  BICYCLE_RENTAL = 'BICYCLE_RENTAL',
  OTHER = 'OTHER',
}

export enum PriceRange {
  BUDGET = 'BUDGET',
  MODERATE = 'MODERATE',
  PREMIUM = 'PREMIUM',
}

export interface UserDto {
  id: string;
  email: string;
  role: Role;
  emailConfirmed: boolean;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  createdAt: string;
}

export interface TouristAttractionDto {
  id: string;
  titleRo: string;
  titleEn: string;
  descriptionRo: string;
  descriptionEn: string;
  latitude: number;
  longitude: number;
  images: string[];
  isLocationOfMonth: boolean;
  createdAt: string;
}

export interface PropertyDto {
  id: string;
  type: PropertyType;
  titleRo: string;
  titleEn: string;
  descriptionRo: string;
  descriptionEn: string;
  address: string | null;
  latitude: number;
  longitude: number;
  pricePerNight: number;
  images: string[];
  ownerId: string;
  status: PropertyStatus;
  amenities: string[];
  maxGuests: number;
  rooms: number;
  promotionOrder: number | null;
  owner?: UserDto;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceDto {
  id: string;
  category: ServiceCategory;
  titleRo: string;
  titleEn: string;
  descriptionRo: string;
  descriptionEn: string;
  images: string[];
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  priceInfo: string | null;
  latitude: number | null;
  longitude: number | null;
  ownerId: string;
  status: PropertyStatus;
  owner?: UserDto;
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantDto {
  id: string;
  titleRo: string;
  titleEn: string;
  descriptionRo: string;
  descriptionEn: string;
  cuisineRo: string | null;
  cuisineEn: string | null;
  images: string[];
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  priceRange: PriceRange;
  openingHours: string | null;
  latitude: number | null;
  longitude: number | null;
  ownerId: string;
  status: PropertyStatus;
  owner?: UserDto;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: UserDto;
}

export interface RegisterResponse {
  message: string;
}

export interface PropertyFilterDto {
  type?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  status?: PropertyStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ServiceFilterDto {
  category?: ServiceCategory;
  status?: PropertyStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface RestaurantFilterDto {
  priceRange?: PriceRange;
  status?: PropertyStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreatePropertyDto {
  type: PropertyType;
  titleRo: string;
  titleEn: string;
  descriptionRo: string;
  descriptionEn: string;
  address?: string;
  latitude: number;
  longitude: number;
  pricePerNight: number;
  images: string[];
  amenities: string[];
  maxGuests: number;
  rooms: number;
}

export interface UpdatePropertyDto extends Partial<CreatePropertyDto> {}

export interface CreateServiceDto {
  category: ServiceCategory;
  titleRo: string;
  titleEn: string;
  descriptionRo: string;
  descriptionEn: string;
  images?: string[];
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  priceInfo?: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateServiceDto extends Partial<CreateServiceDto> {}

export interface CreateRestaurantDto {
  titleRo: string;
  titleEn: string;
  descriptionRo: string;
  descriptionEn: string;
  cuisineRo?: string;
  cuisineEn?: string;
  images?: string[];
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  priceRange?: PriceRange;
  openingHours?: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateRestaurantDto extends Partial<CreateRestaurantDto> {}

export interface UpdatePropertyStatusDto {
  status: PropertyStatus;
}

export interface AdminStats {
  totalUsers: number;
  totalProperties: number;
  pendingProperties: number;
  totalServices: number;
  pendingServices: number;
  totalRestaurants: number;
  pendingRestaurants: number;
  totalAttractions: number;
}
