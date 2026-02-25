'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Check, X, Trash2, ChevronLeft, ChevronRight, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/auth-context';
import { getLocalizedField } from '@/lib/utils';
import * as api from '@/lib/api';

function statusBadgeVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'APPROVED':
      return 'default';
    case 'PENDING':
      return 'outline';
    case 'DRAFT':
      return 'secondary';
    default:
      return 'secondary';
  }
}

function priceRangeBadgeVariant(priceRange: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (priceRange) {
    case 'PREMIUM':
      return 'default';
    case 'MODERATE':
      return 'outline';
    case 'BUDGET':
      return 'secondary';
    default:
      return 'secondary';
  }
}

export default function AdminRestaurantePage() {
  const { token } = useAuth();
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 12;

  const locale = i18n.language;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-restaurants', page],
    queryFn: () => api.getAdminRestaurants(token!, page, limit),
    enabled: !!token,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.updateRestaurantStatus(token!, id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.adminDeleteRestaurant(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: (id: string) => api.toggleRestaurantActive(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['promoted-restaurants'] });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm(t('admin.restaurants.confirmDelete'))) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">{t('admin.restaurants.title')}</h1>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.restaurants.col.title')}</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.restaurants.col.priceRange')}</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.restaurants.col.status')}</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.active')}</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.restaurants.col.owner')}</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.restaurants.col.date')}</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.restaurants.col.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data?.data.map((restaurant) => (
                  <tr key={restaurant.id} className="hover:bg-muted/30">
                    <td className="max-w-[250px] truncate px-4 py-3 font-medium">
                      {getLocalizedField(restaurant, 'title', locale)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Badge variant={priceRangeBadgeVariant(restaurant.priceRange)}>
                        {t(`priceRanges.${restaurant.priceRange}`)}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Badge variant={statusBadgeVariant(restaurant.status)}>
                        {t(`propertyStatus.${restaurant.status}`)}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Badge variant={restaurant.isActive ? 'default' : 'destructive'}>
                        {restaurant.isActive ? t('admin.active') : t('admin.inactive')}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {restaurant.owner?.email ?? '-'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {new Date(restaurant.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-1">
                        {restaurant.status === 'PENDING' && (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-green-600 hover:text-green-700"
                              onClick={() =>
                                updateStatusMutation.mutate({
                                  id: restaurant.id,
                                  status: 'APPROVED',
                                })
                              }
                              disabled={updateStatusMutation.isPending}
                              title={t('admin.restaurants.approve')}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-red-600 hover:text-red-700"
                              onClick={() =>
                                updateStatusMutation.mutate({
                                  id: restaurant.id,
                                  status: 'DRAFT',
                                })
                              }
                              disabled={updateStatusMutation.isPending}
                              title={t('admin.restaurants.reject')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className={`h-8 w-8 ${restaurant.isActive ? 'text-orange-500 hover:text-orange-600' : 'text-green-600 hover:text-green-700'}`}
                          onClick={() => toggleActiveMutation.mutate(restaurant.id)}
                          disabled={toggleActiveMutation.isPending}
                          title={restaurant.isActive ? t('admin.deactivate') : t('admin.activate')}
                        >
                          <Power className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(restaurant.id)}
                          disabled={deleteMutation.isPending}
                          title={t('admin.restaurants.delete')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {data?.data.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      {t('admin.restaurants.empty')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {t('admin.pagination.showing', {
                  from: (page - 1) * limit + 1,
                  to: Math.min(page * limit, data.total),
                  total: data.total,
                })}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  {page} / {data.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                  disabled={page === data.totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
