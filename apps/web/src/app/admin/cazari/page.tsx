'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Check, X, Trash2, ChevronLeft, ChevronRight, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/auth-context';
import { getLocalizedField } from '@/lib/utils';
import * as api from '@/lib/api';

const STATUS_OPTIONS = ['', 'DRAFT', 'PENDING', 'APPROVED'] as const;

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

export default function AdminCazariPage() {
  const { token } = useAuth();
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 12;

  const locale = i18n.language;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-properties', statusFilter, page],
    queryFn: () =>
      api.getAdminProperties(token!, {
        status: statusFilter || undefined,
        page,
        limit,
      }),
    enabled: !!token,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.updatePropertyStatus(token!, id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.adminDeleteProperty(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: (id: string) => api.togglePropertyActive(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['promoted-properties'] });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm(t('admin.properties.confirmDelete'))) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">{t('admin.properties.title')}</h1>
        <Select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="w-full sm:w-48"
        >
          <option value="">{t('admin.properties.allStatuses')}</option>
          {STATUS_OPTIONS.filter(Boolean).map((s) => (
            <option key={s} value={s}>
              {t(`admin.properties.status.${s}`)}
            </option>
          ))}
        </Select>
      </div>

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
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.properties.col.image')}</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.properties.col.title')}</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.properties.col.type')}</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.properties.col.status')}</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.active')}</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.properties.col.owner')}</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.properties.col.date')}</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.properties.col.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data?.data.map((property) => (
                  <tr key={property.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      {property.images?.[0] ? (
                        <Image
                          src={property.images[0]}
                          alt={getLocalizedField(property, 'title', locale)}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-md object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
                          --
                        </div>
                      )}
                    </td>
                    <td className="max-w-[200px] truncate px-4 py-3 font-medium">
                      {getLocalizedField(property, 'title', locale)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Badge variant="secondary">{t(`propertyTypes.${property.type}`)}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Badge variant={statusBadgeVariant(property.status)}>
                        {t(`admin.properties.status.${property.status}`)}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Badge variant={property.isActive ? 'default' : 'destructive'}>
                        {property.isActive ? t('admin.active') : t('admin.inactive')}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {property.owner?.email ?? '-'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-1">
                        {property.status === 'PENDING' && (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-green-600 hover:text-green-700"
                              onClick={() =>
                                updateStatusMutation.mutate({
                                  id: property.id,
                                  status: 'APPROVED',
                                })
                              }
                              disabled={updateStatusMutation.isPending}
                              title={t('admin.properties.approve')}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-red-600 hover:text-red-700"
                              onClick={() =>
                                updateStatusMutation.mutate({
                                  id: property.id,
                                  status: 'DRAFT',
                                })
                              }
                              disabled={updateStatusMutation.isPending}
                              title={t('admin.properties.reject')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className={`h-8 w-8 ${property.isActive ? 'text-orange-500 hover:text-orange-600' : 'text-green-600 hover:text-green-700'}`}
                          onClick={() => toggleActiveMutation.mutate(property.id)}
                          disabled={toggleActiveMutation.isPending}
                          title={property.isActive ? t('admin.deactivate') : t('admin.activate')}
                        >
                          <Power className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(property.id)}
                          disabled={deleteMutation.isPending}
                          title={t('admin.properties.delete')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {data?.data.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                      {t('admin.properties.empty')}
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
