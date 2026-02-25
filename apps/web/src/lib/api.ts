const API_BASE = '/api';

interface FetchOptions extends RequestInit {
  token?: string;
}

async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, headers: customHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((customHeaders as Record<string, string>) ?? {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers,
    ...rest,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(res.status, errorBody.message ?? 'Request failed');
  }

  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// --- Auth ---
export interface AuthResponse {
  accessToken: string;
  user: UserDto;
}

export interface RegisterResponse {
  message: string;
}

export interface UserDto {
  id: string;
  email: string;
  role: 'CLIENT' | 'ADMIN';
  emailConfirmed: boolean;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  createdAt: string;
}

export function login(email: string, password: string) {
  return fetchApi<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function register(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  captchaToken: string;
}) {
  return fetchApi<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getProfile(token: string) {
  return fetchApi<UserDto>('/auth/profile', { token });
}

// --- Properties ---
export interface PropertyDto {
  id: string;
  type: 'HOTEL' | 'VILA' | 'PENSIUNE' | 'CABANA' | 'APARTAMENT' | 'CAMERA' | 'CASA_VACANTA';
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
  status: 'DRAFT' | 'PENDING' | 'APPROVED';
  isActive: boolean;
  amenities: string[];
  maxGuests: number;
  rooms: number;
  mealPolicy: string;
  paymentMethods: string[];
  depositRequired: boolean;
  depositPolicyRo: string | null;
  depositPolicyEn: string | null;
  website: string | null;
  priceWholeUnit: number | null;
  paidExtras: string[];
  promotionOrder: number | null;
  owner?: { id: string; email: string; firstName: string | null; lastName: string | null; phone: string | null };
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

export interface PropertyFilter {
  type?: string;
  status?: string;
  search?: string;
  rentalType?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildParams(filter: Record<string, any>): string {
  const params = new URLSearchParams();
  Object.entries(filter).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export function getProperties(filter: PropertyFilter = {}) {
  return fetchApi<PaginatedResponse<PropertyDto>>(`/properties?${buildParams(filter)}`);
}

export function getFeaturedProperties() {
  return fetchApi<PropertyDto[]>('/properties/featured');
}

export function getPromotedProperties() {
  return fetchApi<PropertyDto[]>('/properties/promoted');
}

export function getPropertyById(id: string) {
  return fetchApi<PropertyDto>(`/properties/${id}`);
}

export function getMyProperties(token: string, filter: PropertyFilter = {}) {
  return fetchApi<PaginatedResponse<PropertyDto>>(`/properties/my?${buildParams(filter)}`, { token });
}

export function createProperty(token: string, data: Record<string, unknown>) {
  return fetchApi<PropertyDto>('/properties', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  });
}

export function updateProperty(token: string, id: string, data: Record<string, unknown>) {
  return fetchApi<PropertyDto>(`/properties/${id}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(data),
  });
}

export function deleteProperty(token: string, id: string) {
  return fetchApi<{ message: string }>(`/properties/${id}`, {
    method: 'DELETE',
    token,
  });
}

// --- Services ---
export interface ServiceDto {
  id: string;
  category: 'ATV' | 'SNOWMOBILE' | 'HORSEBACK_RIDING' | 'HIKING' | 'SKIING' | 'BICYCLE_RENTAL' | 'RAFTING' | 'OTHER';
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
  status: 'DRAFT' | 'PENDING' | 'APPROVED';
  isActive: boolean;
  promotionOrder: number | null;
  owner?: { id: string; email: string; firstName: string | null; lastName: string | null };
  createdAt: string;
  updatedAt: string;
}

export interface ServiceFilter {
  category?: string;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}

export function getServices(filter: ServiceFilter = {}) {
  return fetchApi<PaginatedResponse<ServiceDto>>(`/services?${buildParams(filter)}`);
}

export function getFeaturedServices() {
  return fetchApi<ServiceDto[]>('/services/featured');
}

export function getPromotedServices() {
  return fetchApi<ServiceDto[]>('/services/promoted');
}

export function getServiceById(id: string) {
  return fetchApi<ServiceDto>(`/services/${id}`);
}

export function getMyServices(token: string, filter: ServiceFilter = {}) {
  return fetchApi<PaginatedResponse<ServiceDto>>(`/services/my?${buildParams(filter)}`, { token });
}

export function createService(token: string, data: Record<string, unknown>) {
  return fetchApi<ServiceDto>('/services', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  });
}

export function updateService(token: string, id: string, data: Record<string, unknown>) {
  return fetchApi<ServiceDto>(`/services/${id}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(data),
  });
}

export function deleteService(token: string, id: string) {
  return fetchApi<{ message: string }>(`/services/${id}`, {
    method: 'DELETE',
    token,
  });
}

// --- Restaurants ---
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
  priceRange: 'BUDGET' | 'MODERATE' | 'PREMIUM';
  openingHours: string | null;
  latitude: number | null;
  longitude: number | null;
  ownerId: string;
  status: 'DRAFT' | 'PENDING' | 'APPROVED';
  isActive: boolean;
  promotionOrder: number | null;
  owner?: { id: string; email: string; firstName: string | null; lastName: string | null };
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantFilter {
  priceRange?: string;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}

export function getRestaurants(filter: RestaurantFilter = {}) {
  return fetchApi<PaginatedResponse<RestaurantDto>>(`/restaurants?${buildParams(filter)}`);
}

export function getFeaturedRestaurants() {
  return fetchApi<RestaurantDto[]>('/restaurants/featured');
}

export function getPromotedRestaurants() {
  return fetchApi<RestaurantDto[]>('/restaurants/promoted');
}

export function getRestaurantById(id: string) {
  return fetchApi<RestaurantDto>(`/restaurants/${id}`);
}

export function getMyRestaurants(token: string, filter: RestaurantFilter = {}) {
  return fetchApi<PaginatedResponse<RestaurantDto>>(`/restaurants/my?${buildParams(filter)}`, { token });
}

export function createRestaurant(token: string, data: Record<string, unknown>) {
  return fetchApi<RestaurantDto>('/restaurants', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  });
}

export function updateRestaurant(token: string, id: string, data: Record<string, unknown>) {
  return fetchApi<RestaurantDto>(`/restaurants/${id}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(data),
  });
}

export function deleteRestaurant(token: string, id: string) {
  return fetchApi<{ message: string }>(`/restaurants/${id}`, {
    method: 'DELETE',
    token,
  });
}

// --- Attractions ---
export interface AttractionDto {
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

export function getAttractions(page = 1, limit = 12) {
  return fetchApi<PaginatedResponse<AttractionDto>>(`/attractions?page=${page}&limit=${limit}`);
}

export function getFeaturedAttractions() {
  return fetchApi<AttractionDto[]>('/attractions/featured');
}

export function getAttractionById(id: string) {
  return fetchApi<AttractionDto>(`/attractions/${id}`);
}

export interface LocationOfMonthResponse {
  type: 'PROPERTY' | 'SERVICE' | 'RESTAURANT' | 'ATTRACTION';
  entity: PropertyDto | ServiceDto | RestaurantDto | AttractionDto;
}

export function getLocationOfMonth() {
  return fetchApi<LocationOfMonthResponse | null>('/attractions/location-of-month');
}

export function getNearbyAttractions(lat: number, lng: number, radius = 50) {
  return fetchApi<(AttractionDto & { distance: number })[]>(
    `/attractions/nearby?lat=${lat}&lng=${lng}&radius=${radius}`,
  );
}

// --- Upload ---
export async function uploadImage(token: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/upload/image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    throw new ApiError(res.status, 'Upload failed');
  }

  const data = (await res.json()) as { url: string };
  return data.url;
}

export async function uploadImages(token: string, files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const res = await fetch(`${API_BASE}/upload/images`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    throw new ApiError(res.status, 'Upload failed');
  }

  const data = (await res.json()) as { urls: string[] };
  return data.urls;
}

// --- Contact Clicks ---
export function trackContactClick(data: {
  entityType: 'PROPERTY' | 'SERVICE' | 'RESTAURANT';
  entityId: string;
  contactType: 'PHONE' | 'EMAIL' | 'WEBSITE' | 'WHATSAPP';
}) {
  return fetchApi<{ id: string }>('/contact-clicks', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// --- Admin ---
export interface AdminStats {
  totalUsers: number;
  totalProperties: number;
  pendingProperties: number;
  totalServices: number;
  pendingServices: number;
  totalRestaurants: number;
  pendingRestaurants: number;
  totalAttractions: number;
  totalContactClicks: number;
}

export function getAdminStats(token: string) {
  return fetchApi<AdminStats>('/admin/stats', { token });
}

export function getAdminProperties(token: string, filter: PropertyFilter = {}) {
  return fetchApi<PaginatedResponse<PropertyDto>>(`/admin/properties?${buildParams(filter)}`, { token });
}

export function updatePropertyStatus(token: string, id: string, status: string) {
  return fetchApi<PropertyDto>(`/admin/properties/${id}/status`, {
    method: 'PATCH',
    token,
    body: JSON.stringify({ status }),
  });
}

export function adminDeleteProperty(token: string, id: string) {
  return fetchApi<{ message: string }>(`/admin/properties/${id}`, {
    method: 'DELETE',
    token,
  });
}

export function getAdminServices(token: string, page = 1, limit = 12) {
  return fetchApi<PaginatedResponse<ServiceDto>>(`/admin/services?page=${page}&limit=${limit}`, { token });
}

export function updateServiceStatus(token: string, id: string, status: string) {
  return fetchApi<ServiceDto>(`/admin/services/${id}/status`, {
    method: 'PATCH',
    token,
    body: JSON.stringify({ status }),
  });
}

export function adminDeleteService(token: string, id: string) {
  return fetchApi<{ message: string }>(`/admin/services/${id}`, {
    method: 'DELETE',
    token,
  });
}

export function getAdminRestaurants(token: string, page = 1, limit = 12) {
  return fetchApi<PaginatedResponse<RestaurantDto>>(`/admin/restaurants?page=${page}&limit=${limit}`, { token });
}

export function updateRestaurantStatus(token: string, id: string, status: string) {
  return fetchApi<RestaurantDto>(`/admin/restaurants/${id}/status`, {
    method: 'PATCH',
    token,
    body: JSON.stringify({ status }),
  });
}

export function adminDeleteRestaurant(token: string, id: string) {
  return fetchApi<{ message: string }>(`/admin/restaurants/${id}`, {
    method: 'DELETE',
    token,
  });
}

export function togglePropertyActive(token: string, id: string) {
  return fetchApi<PropertyDto>(`/admin/properties/${id}/toggle-active`, {
    method: 'PATCH',
    token,
  });
}

export function toggleServiceActive(token: string, id: string) {
  return fetchApi<ServiceDto>(`/admin/services/${id}/toggle-active`, {
    method: 'PATCH',
    token,
  });
}

export function toggleRestaurantActive(token: string, id: string) {
  return fetchApi<RestaurantDto>(`/admin/restaurants/${id}/toggle-active`, {
    method: 'PATCH',
    token,
  });
}

export function getAdminUsers(token: string, page = 1, limit = 12) {
  return fetchApi<PaginatedResponse<UserDto & { _count: { properties: number; services: number; restaurants: number } }>>(
    `/admin/users?page=${page}&limit=${limit}`,
    { token },
  );
}

export function updateUserRole(token: string, id: string, data: { role?: string }) {
  return fetchApi<UserDto>(`/admin/users/${id}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(data),
  });
}

export function adminDeleteUser(token: string, id: string) {
  return fetchApi<{ message: string }>(`/admin/users/${id}`, {
    method: 'DELETE',
    token,
  });
}

export function adminCreateAttraction(token: string, data: Record<string, unknown>) {
  return fetchApi<AttractionDto>('/admin/attractions', {
    method: 'POST',
    token,
    body: JSON.stringify(data),
  });
}

export function adminUpdateAttraction(token: string, id: string, data: Record<string, unknown>) {
  return fetchApi<AttractionDto>(`/admin/attractions/${id}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(data),
  });
}

export function adminDeleteAttraction(token: string, id: string) {
  return fetchApi<{ message: string }>(`/admin/attractions/${id}`, {
    method: 'DELETE',
    token,
  });
}

export function setPromotedProperties(token: string, propertyIds: string[]) {
  return fetchApi<{ message: string; count: number }>('/admin/promoted', {
    method: 'POST',
    token,
    body: JSON.stringify({ propertyIds }),
  });
}

export function setPromotedServices(token: string, serviceIds: string[]) {
  return fetchApi<{ message: string; count: number }>('/admin/promoted-services', {
    method: 'POST',
    token,
    body: JSON.stringify({ serviceIds }),
  });
}

export function setPromotedRestaurants(token: string, restaurantIds: string[]) {
  return fetchApi<{ message: string; count: number }>('/admin/promoted-restaurants', {
    method: 'POST',
    token,
    body: JSON.stringify({ restaurantIds }),
  });
}

export function setLocationOfMonth(token: string, entityType: string, entityId: string) {
  return fetchApi<LocationOfMonthResponse>('/admin/location-of-month', {
    method: 'POST',
    token,
    body: JSON.stringify({ entityType, entityId }),
  });
}

export function updateProfile(token: string, data: { firstName?: string; lastName?: string; phone?: string }) {
  return fetchApi<UserDto>('/users/me', {
    method: 'PATCH',
    token,
    body: JSON.stringify(data),
  });
}
