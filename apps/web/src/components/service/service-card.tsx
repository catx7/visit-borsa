'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  Tag,
  Crown,
  Bike,
  Snowflake,
  TreePine,
  Mountain,
  PersonStanding,
  Car,
  Camera,
  Wrench,
  Zap,
  Truck,
  CloudSnow,
  Sparkles,
  Dumbbell,
  Music,
  Music2,
  ChefHat,
  HelpCircle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getLocalizedField } from '@/lib/utils';
import type { ServiceDto } from '@/lib/api';

const CATEGORY_CONFIG: Record<string, { icon: typeof Tag; color: string }> = {
  ATV: { icon: Bike, color: 'bg-orange-500/90 text-white' },
  SNOWMOBILE: { icon: Snowflake, color: 'bg-cyan-500/90 text-white' },
  HORSEBACK_RIDING: { icon: TreePine, color: 'bg-amber-600/90 text-white' },
  HIKING: { icon: Mountain, color: 'bg-emerald-500/90 text-white' },
  SKIING: { icon: PersonStanding, color: 'bg-blue-500/90 text-white' },
  BICYCLE_RENTAL: { icon: Bike, color: 'bg-lime-500/90 text-white' },
  RAFTING: { icon: Sparkles, color: 'bg-teal-500/90 text-white' },
  TAXI_LOCAL: { icon: Car, color: 'bg-yellow-500/90 text-white' },
  RENT_A_CAR: { icon: Car, color: 'bg-indigo-500/90 text-white' },
  FOTOGRAF: { icon: Camera, color: 'bg-pink-500/90 text-white' },
  INSTALATOR: { icon: Wrench, color: 'bg-slate-500/90 text-white' },
  ELECTRICIAN: { icon: Zap, color: 'bg-yellow-600/90 text-white' },
  TRANSPORT_MARFA: { icon: Truck, color: 'bg-stone-500/90 text-white' },
  DESZAPEZIRE: { icon: CloudSnow, color: 'bg-sky-500/90 text-white' },
  MASAJ: { icon: Sparkles, color: 'bg-purple-500/90 text-white' },
  INSTRUCTOR_FITNESS: { icon: Dumbbell, color: 'bg-red-500/90 text-white' },
  DJ: { icon: Music, color: 'bg-violet-500/90 text-white' },
  MUZICA_LIVE: { icon: Music2, color: 'bg-fuchsia-500/90 text-white' },
  CATERING: { icon: ChefHat, color: 'bg-orange-400/90 text-white' },
  OTHER: { icon: HelpCircle, color: 'bg-gray-500/90 text-white' },
};

export function ServiceCard({ service }: { service: ServiceDto }) {
  const { t, i18n } = useTranslation();
  const title = getLocalizedField(service, 'title', i18n.language);
  const description = getLocalizedField(service, 'description', i18n.language);
  const categoryLabel = t(`serviceCategories.${service.category}`);
  const config = CATEGORY_CONFIG[service.category] ?? CATEGORY_CONFIG.OTHER;
  const Icon = config.icon;

  return (
    <Link href={`/servicii/${service.id}`}>
      <Card className="group border-0 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-500 ease-out overflow-hidden">
        <div className="relative aspect-4/3 overflow-hidden">
          {service.images[0] ? (
            <Image
              src={service.images[0]}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <Icon className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
          <span className={`absolute left-3 top-3 flex items-center gap-1.5 rounded-full backdrop-blur-sm px-3 py-1 text-xs font-semibold shadow-sm ${config.color}`}>
            <Icon className="h-3 w-3" />
            {categoryLabel}
          </span>
          {service.promotionOrder != null && (
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-400/95 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-amber-950 shadow-sm">
              <Crown className="h-3 w-3" />
              {t('properties.premium')}
            </span>
          )}
        </div>
        <CardContent className="p-5">
          <h3 className="line-clamp-1 font-semibold text-lg tracking-tight">{title}</h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{description}</p>
          {service.priceInfo && (
            <div className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-accent">
              <Tag className="h-3.5 w-3.5" />
              <span>{service.priceInfo}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
