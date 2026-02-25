'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AttractionCard } from '@/components/attraction/attraction-card';
import * as api from '@/lib/api';

export default function DeVizitatPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['attractions', page],
    queryFn: () => api.getAttractions(page, 12),
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl tracking-tight sm:text-4xl">{t('attractions.title')}</h1>

      {/* Results */}
      <div className="mt-8">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-4/3 rounded-lg" />
            ))}
          </div>
        ) : isError ? (
          <p className="text-center text-muted-foreground py-12">{t('attractions.noResults')}</p>
        ) : data && data.data.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.data.map((attraction) => (
                <AttractionCard key={attraction.id} attraction={attraction} />
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
          <p className="text-center text-muted-foreground py-12">{t('attractions.noResults')}</p>
        )}
      </div>
    </div>
  );
}
