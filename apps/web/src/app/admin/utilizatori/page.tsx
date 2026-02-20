'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Trash2, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/auth-context';
import * as api from '@/lib/api';

export default function AdminUtilizatoriPage() {
  const { token } = useAuth();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: () => api.getAdminUsers(token!, page, limit),
    enabled: !!token,
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      api.updateUserRole(token!, id, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.adminDeleteUser(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm(t('admin.users.confirmDelete'))) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleRole = (id: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'CLIENT' : 'ADMIN';
    updateRoleMutation.mutate({ id, role: newRole });
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">{t('admin.users.title')}</h1>

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
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.users.col.name')}</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.users.col.email')}</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.users.col.role')}</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.users.col.emailConfirmed')}</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.users.col.properties')}</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.users.col.services')}</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.users.col.restaurants')}</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.users.col.date')}</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.users.col.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data?.data.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30">
                    <td className="whitespace-nowrap px-4 py-3 font-medium">
                      {`${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || '-'}
                    </td>
                    <td className="max-w-[200px] truncate px-4 py-3">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Badge variant={user.emailConfirmed ? 'default' : 'outline'}>
                        {user.emailConfirmed
                          ? t('admin.users.confirmed')
                          : t('admin.users.unconfirmed')}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-center">
                      {user._count?.properties ?? 0}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-center">
                      {user._count?.services ?? 0}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-center">
                      {user._count?.restaurants ?? 0}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleRole(user.id, user.role)}
                          disabled={updateRoleMutation.isPending}
                          title={t('admin.users.toggleRole')}
                        >
                          <Shield className="mr-1 h-3 w-3" />
                          {user.role === 'ADMIN'
                            ? t('admin.users.makeClient')
                            : t('admin.users.makeAdmin')}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(user.id)}
                          disabled={deleteMutation.isPending}
                          title={t('admin.users.delete')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {data?.data.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                      {t('admin.users.empty')}
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
