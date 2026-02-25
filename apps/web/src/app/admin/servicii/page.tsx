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

export default function AdminServiciiPage() {
  const { token } = useAuth();
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 12;

  const locale = i18n.language;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-services', page],
    queryFn: () => api.getAdminServices(token!, page, limit),
    enabled: !!token,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.updateServiceStatus(token!, id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.adminDeleteService(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: (id: string) => api.toggleServiceActive(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['promoted-services'] });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm(t('admin.services.confirmDelete'))) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">{t('admin.services.title')}</h1>

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
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.services.col.title')}</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.services.col.category')}</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.services.col.status')}</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.active')}</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.services.col.owner')}</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.services.col.date')}</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.services.col.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data?.data.map((service) => (
                  <tr key={service.id} className="hover:bg-muted/30">
                    <td className="max-w-[250px] truncate px-4 py-3 font-medium">
                      {getLocalizedField(service, 'title', locale)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Badge variant="secondary">{t(`serviceCategories.${service.category}`)}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Badge variant={statusBadgeVariant(service.status)}>
                        {t(`propertyStatus.${service.status}`)}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Badge variant={service.isActive ? 'default' : 'destructive'}>
                        {service.isActive ? t('admin.active') : t('admin.inactive')}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {service.owner?.email ?? '-'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {new Date(service.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-1">
                        {service.status === 'PENDING' && (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-green-600 hover:text-green-700"
                              onClick={() =>
                                updateStatusMutation.mutate({
                                  id: service.id,
                                  status: 'APPROVED',
                                })
                              }
                              disabled={updateStatusMutation.isPending}
                              title={t('admin.services.approve')}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-red-600 hover:text-red-700"
                              onClick={() =>
                                updateStatusMutation.mutate({
                                  id: service.id,
                                  status: 'DRAFT',
                                })
                              }
                              disabled={updateStatusMutation.isPending}
                              title={t('admin.services.reject')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className={`h-8 w-8 ${service.isActive ? 'text-orange-500 hover:text-orange-600' : 'text-green-600 hover:text-green-700'}`}
                          onClick={() => toggleActiveMutation.mutate(service.id)}
                          disabled={toggleActiveMutation.isPending}
                          title={service.isActive ? t('admin.deactivate') : t('admin.activate')}
                        >
                          <Power className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(service.id)}
                          disabled={deleteMutation.isPending}
                          title={t('admin.services.delete')}
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
                      {t('admin.services.empty')}
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
