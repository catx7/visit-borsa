'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Star, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getLocalizedField } from '@/lib/utils';
import type { AttractionDto } from '@/lib/api';

export function AttractionCard({ attraction }: { attraction: AttractionDto }) {
  const { t, i18n } = useTranslation();
  const title = getLocalizedField(attraction, 'title', i18n.language);
  const description = getLocalizedField(attraction, 'description', i18n.language);

  return (
    <Link href={`/de-vizitat/${attraction.id}`}>
      <Card className="group border-0 overflow-hidden hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-500 ease-out">
        <div className="relative aspect-[4/3] overflow-hidden">
          {attraction.images[0] ? (
            <Image
              src={attraction.images[0]}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <MapPin className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />
          {attraction.isLocationOfMonth && (
            <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-amber-500/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white shadow-sm">
              <Star className="h-3 w-3 fill-current" />
              {t('attractions.locationOfMonth')}
            </span>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="line-clamp-1 font-bold text-lg text-white drop-shadow-sm">{title}</h3>
          </div>
        </div>
        <CardContent className="p-4">
          <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
