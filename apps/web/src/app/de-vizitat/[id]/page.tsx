'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { JsonLd } from '@/components/seo/json-ld';
import { getLocalizedField } from '@/lib/utils';
import * as api from '@/lib/api';

export default function AttractionDetailPage() {
  const { t, i18n } = useTranslation();
  const params = useParams();
  const id = params.id as string;
  const [currentImage, setCurrentImage] = useState(0);

  const { data: attraction, isLoading, isError } = useQuery({
    queryKey: ['attraction', id],
    queryFn: () => api.getAttractionById(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="aspect-video w-full rounded-lg" />
        <div className="mt-6 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !attraction) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-muted-foreground">{t('common.error')}</p>
        <Link href="/de-vizitat">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('attractions.title')}
          </Button>
        </Link>
      </div>
    );
  }

  const title = getLocalizedField(attraction, 'title', i18n.language);
  const description = getLocalizedField(attraction, 'description', i18n.language);
  const images = attraction.images;

  const prevImage = () => setCurrentImage((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextImage = () => setCurrentImage((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'TouristAttraction',
        name: title,
        description: description,
        geo: { '@type': 'GeoCoordinates', latitude: attraction.latitude, longitude: attraction.longitude },
        image: images[0],
        url: `https://visitborsa.ro/de-vizitat/${attraction.id}`,
      }} />

      {/* Back link */}
      <Link href="/de-vizitat" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        {t('attractions.title')}
      </Link>

      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <Image
            src={images[currentImage]}
            alt={`${title} - ${currentImage + 1}`}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      i === currentImage ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Content */}
      <div className="mt-8 max-w-3xl">
        <div className="flex items-center gap-3 flex-wrap">
          {attraction.isLocationOfMonth && (
            <Badge className="gap-1">
              <Star className="h-3 w-3" />
              {t('attractions.locationOfMonth')}
            </Badge>
          )}
        </div>
        <h1 className="mt-3 text-3xl font-bold">{title}</h1>

        <Card className="mt-6">
          <CardContent className="p-6">
            <p className="text-muted-foreground whitespace-pre-line">{description}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
