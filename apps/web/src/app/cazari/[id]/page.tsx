'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  Users,
  DoorOpen,
  ArrowLeft,
  UtensilsCrossed,
  CreditCard,
  Shield,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { ImageGallery } from '@/components/ui/image-gallery';
import { RevealContactButton } from '@/components/ui/reveal-contact-button';
import { WhatsAppBookingButton } from '@/components/ui/whatsapp-booking-button';
import { AttractionCard } from '@/components/attraction/attraction-card';
import { MapDisplayDynamic } from '@/components/map/map-display-dynamic';
import { JsonLd } from '@/components/seo/json-ld';
import { formatPrice, getLocalizedField } from '@/lib/utils';
import * as api from '@/lib/api';

export default function CazareDetailPage() {
  const { t, i18n } = useTranslation();
  const params = useParams();
  const id = params.id as string;

  const { data: property, isLoading, isError } = useQuery({
    queryKey: ['property', id],
    queryFn: () => api.getPropertyById(id),
    enabled: !!id,
  });

  const { data: nearbyAttractions } = useQuery({
    queryKey: ['nearby-attractions', property?.latitude, property?.longitude],
    queryFn: () => api.getNearbyAttractions(property!.latitude, property!.longitude, 10),
    enabled: !!property?.latitude && !!property?.longitude,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="aspect-video w-full rounded-lg" />
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div>
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !property || property.status !== 'APPROVED' || !property.isActive) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-muted-foreground">{t('common.error')}</p>
        <Link href="/cazari">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('properties.title')}
          </Button>
        </Link>
      </div>
    );
  }

  const title = getLocalizedField(property, 'title', i18n.language);
  const description = getLocalizedField(property, 'description', i18n.language);
  const typeLabel = t(`propertyTypes.${property.type}`);
  const images = property.images;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'LodgingBusiness',
        name: title,
        description: description,
        address: property.address ? { '@type': 'PostalAddress', streetAddress: property.address, addressLocality: 'Borșa', addressRegion: 'Maramureș', addressCountry: 'RO' } : undefined,
        geo: { '@type': 'GeoCoordinates', latitude: property.latitude, longitude: property.longitude },
        image: images[0],
        priceRange: `${property.pricePerNight} RON`,
        url: `https://visitborsa.ro/cazari/${property.id}`,
      }} />

      {/* Back link */}
      <Link href="/cazari" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        {t('properties.title')}
      </Link>

      {/* Image Gallery */}
      {images.length > 0 && <ImageGallery images={images} alt={title} />}

      {/* Content */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge>{typeLabel}</Badge>
            </div>
            <h1 className="mt-3 text-3xl font-bold">{title}</h1>
            {property.address && (
              <div className="mt-2 flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{property.address}</span>
              </div>
            )}
          </div>

          {/* Details */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-3">{t('properties.details')}</h2>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <DoorOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{property.rooms} {t('properties.rooms')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{property.maxGuests} {t('properties.guests')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-3">{t('properties.description')}</h2>
              <p className="text-muted-foreground whitespace-pre-line">{description}</p>
            </CardContent>
          </Card>

          {/* Amenities */}
          {property.amenities.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-3">{t('properties.amenities')}</h2>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity) => (
                    <Badge key={amenity} variant="secondary">
                      {t(`amenityLabels.${amenity}`, { defaultValue: amenity })}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Meal, Payment & Deposit */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{t('properties.mealPolicy')}:</span>
                <span className="text-sm text-muted-foreground">
                  {t(`mealPolicies.${property.mealPolicy || 'NONE'}`)}
                </span>
              </div>

              {property.paymentMethods && property.paymentMethods.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{t('properties.paymentMethods')}:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {property.paymentMethods.map((method: string) => (
                      <Badge key={method} variant="secondary">
                        {t(`paymentMethodLabels.${method}`, { defaultValue: method })}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{t('properties.deposit')}:</span>
                <span className="text-sm text-muted-foreground">
                  {property.depositRequired ? t('properties.depositYes') : t('properties.depositNo')}
                </span>
              </div>
              {property.depositRequired && (property.depositPolicyRo || property.depositPolicyEn) && (
                <p className="text-sm text-muted-foreground pl-6">
                  {getLocalizedField(property, 'depositPolicy', i18n.language)}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Paid Extras */}
          {property.paidExtras && property.paidExtras.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">{t('properties.paidExtras')}</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {property.paidExtras.map((extra: string) => (
                    <Badge key={extra} variant="secondary">
                      {t(`paidExtraLabels.${extra}`, { defaultValue: extra })}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Card */}
          <Card>
            <CardContent className="p-6 text-center space-y-2">
              <div className="text-3xl font-bold text-primary">
                {formatPrice(property.pricePerNight)}
              </div>
              <span className="text-sm text-muted-foreground">{t('properties.perNight')}</span>
              {property.priceWholeUnit && (
                <>
                  <hr className="my-3 border-border" />
                  <div className="text-2xl font-bold text-primary">
                    {formatPrice(property.priceWholeUnit)}
                  </div>
                  <span className="text-sm text-muted-foreground">{t('properties.perNightWholeUnit')}</span>
                </>
              )}
            </CardContent>
          </Card>

          {/* Contact */}
          {property.owner && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-3">{t('properties.contact')}</h2>
                <div className="space-y-3 text-sm">
                  {(property.owner.firstName || property.owner.lastName) && (
                    <p className="font-medium">
                      {[property.owner.firstName, property.owner.lastName].filter(Boolean).join(' ')}
                    </p>
                  )}
                  {property.owner.phone && (
                    <RevealContactButton
                      value={property.owner.phone}
                      contactType="PHONE"
                      entityType="PROPERTY"
                      entityId={property.id}
                    />
                  )}
                  {property.owner.email && (
                    <RevealContactButton
                      value={property.owner.email}
                      contactType="EMAIL"
                      entityType="PROPERTY"
                      entityId={property.id}
                    />
                  )}
                </div>
                {property.owner.phone && (
                  <>
                    <hr className="my-4 border-border" />
                    <h3 className="text-sm font-semibold mb-3">{t('whatsapp.title')}</h3>
                    <WhatsAppBookingButton
                      phone={property.owner.phone}
                      propertyName={title}
                      entityId={property.id}
                      maxGuests={property.maxGuests}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Map */}
      {property.latitude && property.longitude && (
        <section className="mt-12">
          <h2 className="mb-4 text-2xl font-bold">{t('properties.viewOnMap')}</h2>
          <MapDisplayDynamic latitude={property.latitude} longitude={property.longitude} />
        </section>
      )}

      {/* Nearby Attractions */}
      {nearbyAttractions && nearbyAttractions.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold">{t('properties.nearbyAttractions')}</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {nearbyAttractions.slice(0, 3).map((attraction) => (
              <AttractionCard key={attraction.id} attraction={attraction} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
