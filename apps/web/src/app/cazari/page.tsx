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
import { PropertyCard } from '@/components/property/property-card';
import * as api from '@/lib/api';

const PROPERTY_TYPES = ['HOTEL', 'VILA', 'PENSIUNE', 'CABANA', 'APARTAMENT', 'CAMERA', 'CASA_VACANTA'] as const;

export default function CazariPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [type, setType] = useState(searchParams.get('type') ?? '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const filter: api.PropertyFilter = {
    search: search || undefined,
    type: type || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    status: 'APPROVED',
    page,
    limit: 12,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['properties', filter],
    queryFn: () => api.getProperties(filter),
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (type) params.set('type', type);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (page > 1) params.set('page', String(page));
    router.replace(`/cazari?${params.toString()}`, { scroll: false });
  }, [search, type, minPrice, maxPrice, page, router]);

  const handleReset = () => {
    setSearch('');
    setType('');
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
  };

  const hasFilters = search || type || minPrice || maxPrice;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('properties.title')}</h1>

      {/* Filters */}
      <div className="mt-8 rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">{t('properties.filters')}</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('home.hero.searchPlaceholder')}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-10"
            />
          </div>
          <Select
            value={type}
            onChange={(e) => { setType(e.target.value); setPage(1); }}
          >
            <option value="">{t('propertyTypes.all')}</option>
            {PROPERTY_TYPES.map((pt) => (
              <option key={pt} value={pt}>{t(`propertyTypes.${pt}`)}</option>
            ))}
          </Select>
          <Input
            type="number"
            placeholder={t('properties.minPrice')}
            value={minPrice}
            onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
            min={0}
          />
          <Input
            type="number"
            placeholder={t('properties.maxPrice')}
            value={maxPrice}
            onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
            min={0}
          />
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
          <p className="text-center text-muted-foreground py-12">{t('common.error')}</p>
        ) : data && data.data.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {data.data.map((property) => (
                <PropertyCard key={property.id} property={property} />
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
          <p className="text-center text-muted-foreground py-12">{t('properties.noResults')}</p>
        )}
      </div>
    </div>
  );
}
