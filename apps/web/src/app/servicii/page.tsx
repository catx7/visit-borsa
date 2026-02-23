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
import { ServiceCard } from '@/components/service/service-card';
import * as api from '@/lib/api';

const SERVICE_CATEGORIES = [
  'ATV', 'SNOWMOBILE', 'HORSEBACK_RIDING', 'HIKING',
  'SKIING', 'BICYCLE_RENTAL', 'RAFTING',
  'TAXI_LOCAL', 'RENT_A_CAR', 'FOTOGRAF', 'INSTALATOR',
  'ELECTRICIAN', 'TRANSPORT_MARFA', 'DESZAPEZIRE',
  'MASAJ', 'INSTRUCTOR_FITNESS', 'DJ', 'MUZICA_LIVE', 'CATERING',
  'OTHER',
] as const;

export default function ServiciiPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [category, setCategory] = useState(searchParams.get('category') ?? '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const filter: api.ServiceFilter = {
    search: search || undefined,
    category: category || undefined,
    status: 'APPROVED',
    page,
    limit: 12,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['services', filter],
    queryFn: () => api.getServices(filter),
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (page > 1) params.set('page', String(page));
    router.replace(`/servicii?${params.toString()}`, { scroll: false });
  }, [search, category, page, router]);

  const handleReset = () => {
    setSearch('');
    setCategory('');
    setPage(1);
  };

  const hasFilters = search || category;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('services.title')}</h1>

      {/* Filters */}
      <div className="mt-8 rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
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
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          >
            <option value="">{t('services.allCategories')}</option>
            {SERVICE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{t(`serviceCategories.${cat}`)}</option>
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
          <p className="text-center text-muted-foreground py-12">{t('services.noResults')}</p>
        ) : data && data.data.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {data.data.map((service) => (
                <ServiceCard key={service.id} service={service} />
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
          <p className="text-center text-muted-foreground py-12">{t('services.noResults')}</p>
        )}
      </div>
    </div>
  );
}
