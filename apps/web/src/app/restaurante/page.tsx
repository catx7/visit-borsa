'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { RestaurantCard } from '@/components/restaurant/restaurant-card';
import * as api from '@/lib/api';

const PRICE_RANGES = ['BUDGET', 'MODERATE', 'PREMIUM'] as const;

export default function RestaurantePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [priceRange, setPriceRange] = useState(searchParams.get('priceRange') ?? '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const filter: api.RestaurantFilter = {
    search: search || undefined,
    priceRange: priceRange || undefined,
    status: 'APPROVED',
    page,
    limit: 12,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['restaurants', filter],
    queryFn: () => api.getRestaurants(filter),
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (priceRange) params.set('priceRange', priceRange);
    if (page > 1) params.set('page', String(page));
    router.replace(`/restaurante?${params.toString()}`, { scroll: false });
  }, [search, priceRange, page, router]);

  const handleReset = () => {
    setSearch('');
    setPriceRange('');
    setPage(1);
  };

  const hasFilters = search || priceRange;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl tracking-tight sm:text-4xl">{t('restaurants.title')}</h1>

      {/* Filters */}
      <div className="mt-8 rounded-2xl border border-border/40 bg-secondary/40 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">{t('properties.filters')}</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('properties.search')}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-10"
            />
          </div>
          <Select
            value={priceRange}
            onChange={(e) => { setPriceRange(e.target.value); setPage(1); }}
          >
            <option value="">{t('restaurants.allPrices')}</option>
            {PRICE_RANGES.map((pr) => (
              <option key={pr} value={pr}>{t(`priceRanges.${pr}`)}</option>
            ))}
          </Select>
        </div>
        {hasFilters && (
          <div className="mt-3 flex justify-end">
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <X className="mr-1 h-3 w-3" />
              {t('properties.reset')}
            </Button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mt-10">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-4/3 rounded-lg" />
            ))}
          </div>
        ) : isError ? (
          <p className="text-center text-muted-foreground py-12">{t('restaurants.noResults')}</p>
        ) : data && data.data.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {data.data.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  {t('common.previous')}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {t('common.page', { page: data.page, total: data.totalPages })}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                  disabled={page >= data.totalPages}
                >
                  {t('common.next')}
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-muted-foreground py-12">{t('restaurants.noResults')}</p>
        )}
      </div>
    </div>
  );
}
