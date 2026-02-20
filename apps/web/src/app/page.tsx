'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ArrowRight, Mountain, Star, Bed, Wrench, UtensilsCrossed, Compass } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PropertyCard } from '@/components/property/property-card';
import { AttractionCard } from '@/components/attraction/attraction-card';
import { ServiceCard } from '@/components/service/service-card';
import { RestaurantCard } from '@/components/restaurant/restaurant-card';
import { Skeleton } from '@/components/ui/skeleton';
import { getLocalizedField } from '@/lib/utils';
import * as api from '@/lib/api';

function SectionHeader({
  title,
  href,
  viewAllLabel,
  icon: Icon,
}: {
  title: string;
  href: string;
  viewAllLabel: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-end justify-between mb-10">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        </div>
      </div>
      <Link
        href={href}
        className="flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
      >
        {viewAllLabel} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: locationOfMonth, isLoading: loadingLocation } = useQuery({
    queryKey: ['location-of-month'],
    queryFn: api.getLocationOfMonth,
  });

  const { data: promotedProperties, isLoading: loadingPromoted } = useQuery({
    queryKey: ['promoted-properties'],
    queryFn: api.getPromotedProperties,
  });

  const { data: promotedServices, isLoading: loadingServices } = useQuery({
    queryKey: ['promoted-services'],
    queryFn: api.getPromotedServices,
  });

  const { data: promotedRestaurants, isLoading: loadingRestaurants } = useQuery({
    queryKey: ['promoted-restaurants'],
    queryFn: api.getPromotedRestaurants,
  });

  const { data: featuredAttractions, isLoading: loadingAttractions } = useQuery({
    queryKey: ['featured-attractions'],
    queryFn: api.getFeaturedAttractions,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/cazari?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary py-28 sm:py-40">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&h=900&fit=crop')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/60 to-primary/30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-sm">
              {t('home.hero.title')}
            </h1>
            <p className="mt-5 text-lg text-white/80 sm:text-xl">
              {t('home.hero.subtitle')}
            </p>
            <form onSubmit={handleSearch} className="mt-10 flex gap-3 sm:mx-auto sm:max-w-lg">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t('home.hero.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 rounded-2xl pl-11 text-base bg-white/95 border-0 shadow-lg"
                />
              </div>
              <Button type="submit" className="h-12 rounded-2xl px-6 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg">
                {t('properties.search')}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Location of the Month */}
      {(loadingLocation || locationOfMonth) && (
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <Star className="h-5 w-5 fill-current" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('home.locationOfMonth')}</h2>
            </div>
            <div>
              {loadingLocation ? (
                <Skeleton className="h-72 w-full rounded-2xl" />
              ) : locationOfMonth ? (() => {
                const entity = locationOfMonth.entity;
                const linkMap: Record<string, string> = {
                  PROPERTY: '/cazari',
                  SERVICE: '/servicii',
                  RESTAURANT: '/restaurante',
                  ATTRACTION: '/de-vizitat',
                };
                const href = `${linkMap[locationOfMonth.type] ?? '/de-vizitat'}/${entity.id}`;
                return (
                  <Link href={href}>
                    <div className="group relative overflow-hidden rounded-2xl shadow-lg">
                      <div className="relative h-72 sm:h-112 w-full overflow-hidden">
                        {entity.images?.[0] ? (
                          <Image
                            src={entity.images[0]}
                            alt={getLocalizedField(entity, 'title', i18n.language)}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="100vw"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-muted">
                            <Star className="h-16 w-16 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                          <div className="flex items-center gap-2 text-amber-400 mb-3">
                            <Star className="h-5 w-5 fill-current" />
                            <span className="text-sm font-bold uppercase tracking-widest">
                              {t('home.locationOfMonth')}
                            </span>
                          </div>
                          <h3 className="text-2xl sm:text-4xl font-bold text-white drop-shadow-sm">
                            {getLocalizedField(entity, 'title', i18n.language)}
                          </h3>
                          <p className="mt-3 line-clamp-2 text-base text-white/80 max-w-2xl">
                            {getLocalizedField(entity, 'description', i18n.language)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })() : null}
            </div>
          </div>
        </section>
      )}

      {/* Promoted Properties */}
      <section className="bg-secondary/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={t('home.promotedProperties')}
            href="/cazari"
            viewAllLabel={t('home.viewAll')}
            icon={Bed}
          />
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {loadingPromoted
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-4/3 rounded-2xl" />
                ))
              : promotedProperties?.slice(0, 3).map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
          </div>
        </div>
      </section>

      {/* Promoted Services */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={t('home.promotedServices')}
            href="/servicii"
            viewAllLabel={t('home.viewAll')}
            icon={Wrench}
          />
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {loadingServices
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-4/3 rounded-2xl" />
                ))
              : promotedServices?.slice(0, 3).map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
          </div>
        </div>
      </section>

      {/* Promoted Restaurants */}
      <section className="bg-secondary/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={t('home.promotedRestaurants')}
            href="/restaurante"
            viewAllLabel={t('home.viewAll')}
            icon={UtensilsCrossed}
          />
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {loadingRestaurants
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-4/3 rounded-2xl" />
                ))
              : promotedRestaurants?.slice(0, 3).map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
          </div>
        </div>
      </section>

      {/* Featured Attractions */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={t('home.featuredAttractions')}
            href="/de-vizitat"
            viewAllLabel={t('home.viewAll')}
            icon={Compass}
          />
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {loadingAttractions
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-4/3 rounded-2xl" />
                ))
              : featuredAttractions?.slice(0, 4).map((attraction) => (
                  <AttractionCard key={attraction.id} attraction={attraction} />
                ))}
          </div>
        </div>
      </section>

      {/* Ski Slopes CTA */}
      <section className="relative overflow-hidden bg-primary py-20 mx-4 sm:mx-6 lg:mx-8 rounded-3xl my-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551524559-8af4e6624178?w=1600&h=600&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-linear-to-r from-primary via-primary/90 to-primary/70" />
        <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
          <div className="flex flex-col items-center gap-8 text-center text-white sm:flex-row sm:text-left">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm shrink-0">
              <Mountain className="h-10 w-10" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold sm:text-3xl">{t('home.skiCta')}</h2>
              <p className="mt-2 text-white/75 text-lg">{t('home.skiCtaDesc')}</p>
            </div>
            <Link href="/partia-olimpica">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl px-8 py-6 text-base font-semibold shadow-lg">
                {t('home.viewAll')} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
