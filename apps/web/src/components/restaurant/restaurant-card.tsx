'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Clock, UtensilsCrossed } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getLocalizedField } from '@/lib/utils';
import type { RestaurantDto } from '@/lib/api';

const PRICE_COLORS: Record<string, string> = {
  BUDGET: 'bg-emerald-500/90 text-white',
  MODERATE: 'bg-amber-500/90 text-white',
  PREMIUM: 'bg-violet-500/90 text-white',
};

export function RestaurantCard({ restaurant }: { restaurant: RestaurantDto }) {
  const { t, i18n } = useTranslation();
  const title = getLocalizedField(restaurant, 'title', i18n.language);
  const cuisine = getLocalizedField(restaurant, 'cuisine', i18n.language);
  const priceLabel = t(`priceRanges.${restaurant.priceRange}`);
  const badgeColor = PRICE_COLORS[restaurant.priceRange] ?? 'bg-white/90 text-foreground';

  return (
    <Link href={`/restaurante/${restaurant.id}`}>
      <Card className="group border-0 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
        <div className="relative aspect-4/3 overflow-hidden">
          {restaurant.images[0] ? (
            <Image
              src={restaurant.images[0]}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <UtensilsCrossed className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
          <span className={`absolute left-3 top-3 rounded-full backdrop-blur-sm px-3 py-1 text-xs font-semibold shadow-sm ${badgeColor}`}>
            {priceLabel}
          </span>
        </div>
        <CardContent className="p-5">
          <h3 className="line-clamp-1 font-semibold text-lg tracking-tight">{title}</h3>
          {cuisine && (
            <div className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
              <UtensilsCrossed className="h-3.5 w-3.5 shrink-0 text-accent" />
              <span className="line-clamp-1">{cuisine}</span>
            </div>
          )}
          {restaurant.openingHours && (
            <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5 shrink-0 text-primary/60" />
              <span className="line-clamp-1">{restaurant.openingHours}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
