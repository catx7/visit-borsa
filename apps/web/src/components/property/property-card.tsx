'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { MapPin, Users, DoorOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice, getLocalizedField } from '@/lib/utils';
import type { PropertyDto } from '@/lib/api';

const TYPE_COLORS: Record<string, string> = {
  HOTEL: 'bg-blue-500/90 text-white',
  VILA: 'bg-emerald-500/90 text-white',
  PENSIUNE: 'bg-amber-500/90 text-white',
  CABANA: 'bg-orange-600/90 text-white',
  APARTAMENT: 'bg-violet-500/90 text-white',
  CAMERA: 'bg-cyan-500/90 text-white',
  CASA_VACANTA: 'bg-rose-500/90 text-white',
};

export function PropertyCard({ property }: { property: PropertyDto }) {
  const { t, i18n } = useTranslation();
  const title = getLocalizedField(property, 'title', i18n.language);
  const typeLabel = t(`propertyTypes.${property.type}`);
  const badgeColor = TYPE_COLORS[property.type] ?? 'bg-white/90 text-foreground';

  return (
    <Link href={`/cazari/${property.id}`}>
      <Card className="group border-0 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-500 ease-out overflow-hidden">
        <div className="relative aspect-4/3 overflow-hidden">
          {property.images[0] ? (
            <Image
              src={property.images[0]}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
          <span className={`absolute left-3 top-3 rounded-full backdrop-blur-sm px-3 py-1 text-xs font-semibold shadow-sm ${badgeColor}`}>
            {typeLabel}
          </span>
          <div className="absolute bottom-3 right-3 rounded-lg bg-white/95 backdrop-blur-sm px-3 py-1.5 shadow-sm">
            <span className="font-bold text-primary text-lg tracking-tight">
              {formatPrice(property.pricePerNight)}
            </span>
            <span className="text-xs text-muted-foreground ml-0.5">{t('properties.perNight')}</span>
          </div>
        </div>
        <CardContent className="p-5">
          <h3 className="line-clamp-1 font-semibold text-lg tracking-tight">{title}</h3>
          {property.address && (
            <div className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-accent" />
              <span className="line-clamp-1">{property.address}</span>
            </div>
          )}
          <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <DoorOpen className="h-4 w-4 text-primary/60" />
              {property.rooms} {t('properties.rooms')}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-primary/60" />
              {property.maxGuests} {t('properties.guests')}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
