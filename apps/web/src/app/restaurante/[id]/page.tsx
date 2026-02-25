'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  UtensilsCrossed,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { ImageGallery } from '@/components/ui/image-gallery';
import { RevealContactButton } from '@/components/ui/reveal-contact-button';
import { JsonLd } from '@/components/seo/json-ld';
import { MapDisplayDynamic } from '@/components/map/map-display-dynamic';
import { getLocalizedField } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import * as api from '@/lib/api';

export default function RestaurantDetailPage() {
  const { t, i18n } = useTranslation();
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const { data: restaurant, isLoading, isError } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => api.getRestaurantById(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="aspect-video w-full rounded-lg" />
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div>
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user && restaurant && user.id === restaurant.ownerId;
  const isApproved = restaurant?.status === 'APPROVED' && restaurant?.isActive;

  if (isError || !restaurant || (!isApproved && !isOwner)) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-muted-foreground">{t('common.error')}</p>
        <Link href="/restaurante">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('restaurants.title')}
          </Button>
        </Link>
      </div>
    );
  }

  const title = getLocalizedField(restaurant, 'title', i18n.language);
  const description = getLocalizedField(restaurant, 'description', i18n.language);
  const cuisine = getLocalizedField(restaurant, 'cuisine', i18n.language);
  const priceLabel = t(`priceRanges.${restaurant.priceRange}`);
  const images = restaurant.images;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'Restaurant',
        name: title,
        description: description,
        servesCuisine: cuisine || undefined,
        priceRange: restaurant.priceRange === 'BUDGET' ? '$' : restaurant.priceRange === 'MODERATE' ? '$$' : '$$$',
        address: restaurant.address ? { '@type': 'PostalAddress', streetAddress: restaurant.address, addressLocality: 'Borșa', addressRegion: 'Maramureș', addressCountry: 'RO' } : undefined,
        geo: restaurant.latitude ? { '@type': 'GeoCoordinates', latitude: restaurant.latitude, longitude: restaurant.longitude } : undefined,
        image: images[0],
        url: `https://visitborsa.ro/restaurante/${restaurant.id}`,
      }} />

      {/* Owner preview banner */}
      {isOwner && !isApproved && (
        <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-semibold">{t('ownerPreview.pendingTitle')}</p>
          <p className="mt-1">{t('ownerPreview.pendingDescription')}</p>
        </div>
      )}

      {/* Back link */}
      <Link href="/restaurante" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        {t('restaurants.title')}
      </Link>

      {/* Image Gallery */}
      {images.length > 0 && (
        <ImageGallery images={images} alt={title} />
      )}

      {/* Content */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <Badge variant="secondary">{priceLabel}</Badge>
            <h1 className="mt-3 text-3xl font-bold">{title}</h1>
            {restaurant.address && (
              <div className="mt-2 flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{restaurant.address}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground whitespace-pre-line">{description}</p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cuisine & Hours */}
          <Card>
            <CardContent className="p-6 space-y-4">
              {cuisine && (
                <div>
                  <h2 className="text-sm font-semibold mb-1">{t('restaurants.cuisine')}</h2>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <UtensilsCrossed className="h-4 w-4" />
                    <span>{cuisine}</span>
                  </div>
                </div>
              )}
              {restaurant.openingHours && (
                <div>
                  <h2 className="text-sm font-semibold mb-1">{t('restaurants.openingHours')}</h2>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{restaurant.openingHours}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-3">{t('services.contact')}</h2>
              <div className="space-y-3 text-sm">
                {restaurant.phone && (
                  <RevealContactButton
                    value={restaurant.phone}
                    contactType="PHONE"
                    entityType="RESTAURANT"
                    entityId={restaurant.id}
                  />
                )}
                {restaurant.email && (
                  <RevealContactButton
                    value={restaurant.email}
                    contactType="EMAIL"
                    entityType="RESTAURANT"
                    entityId={restaurant.id}
                  />
                )}
                {restaurant.website && (
                  <RevealContactButton
                    value={restaurant.website}
                    contactType="WEBSITE"
                    entityType="RESTAURANT"
                    entityId={restaurant.id}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Map */}
      {restaurant.latitude && restaurant.longitude && (
        <section className="mt-12">
          <h2 className="mb-4 text-2xl font-bold">{t('properties.viewOnMap')}</h2>
          <MapDisplayDynamic latitude={restaurant.latitude} longitude={restaurant.longitude} />
        </section>
      )}
    </div>
  );
}
