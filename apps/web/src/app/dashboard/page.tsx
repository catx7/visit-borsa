'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  Building2,
  Wrench,
  UtensilsCrossed,
  Plus,
  ArrowRight,
  FileEdit,
  Eye,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import * as api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getLocalizedField, formatPrice } from '@/lib/utils';

export default function DashboardPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { user, token, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const { data: propertiesData, isLoading: loadingProperties } = useQuery({
    queryKey: ['my-properties', token],
    queryFn: () => api.getMyProperties(token!, { limit: 50 }),
    enabled: !!token,
  });

  const { data: servicesData, isLoading: loadingServices } = useQuery({
    queryKey: ['my-services', token],
    queryFn: () => api.getMyServices(token!, { limit: 50 }),
    enabled: !!token,
  });

  const { data: restaurantsData, isLoading: loadingRestaurants } = useQuery({
    queryKey: ['my-restaurants', token],
    queryFn: () => api.getMyRestaurants(token!, { limit: 50 }),
    enabled: !!token,
  });

  if (authLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="mb-8 h-10 w-64" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const allProperties = propertiesData?.data ?? [];
  const allServices = servicesData?.data ?? [];
  const allRestaurants = restaurantsData?.data ?? [];

  const statusBadgeVariant = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'default' as const;
      case 'PENDING':
        return 'secondary' as const;
      case 'DRAFT':
        return 'outline' as const;
      default:
        return 'outline' as const;
    }
  };

  // Build recent listings: merge all types with a type indicator, sort by createdAt, take 5
  type RecentItem = {
    id: string;
    kind: 'property' | 'service' | 'restaurant';
    title: string;
    status: string;
    image: string | undefined;
    createdAt: string;
    extra: string;
    editUrl: string;
    viewUrl: string;
  };

  const recentItems: RecentItem[] = [
    ...allProperties.map((p) => ({
      id: p.id,
      kind: 'property' as const,
      title: getLocalizedField(p, 'title', i18n.language),
      status: p.status,
      image: p.images[0],
      createdAt: p.createdAt,
      extra: formatPrice(p.pricePerNight) + ' ' + t('properties.perNight'),
      editUrl: `/dashboard/cazari/${p.id}/edit`,
      viewUrl: `/cazari/${p.id}`,
    })),
    ...allServices.map((s) => ({
      id: s.id,
      kind: 'service' as const,
      title: getLocalizedField(s, 'title', i18n.language),
      status: s.status,
      image: s.images[0],
      createdAt: s.createdAt,
      extra: t(`serviceCategories.${s.category}`),
      editUrl: `/dashboard/servicii/${s.id}/edit`,
      viewUrl: `/servicii/${s.id}`,
    })),
    ...allRestaurants.map((r) => ({
      id: r.id,
      kind: 'restaurant' as const,
      title: getLocalizedField(r, 'title', i18n.language),
      status: r.status,
      image: r.images[0],
      createdAt: r.createdAt,
      extra: t(`priceRanges.${r.priceRange}`),
      editUrl: `/dashboard/restaurante/${r.id}/edit`,
      viewUrl: `/restaurante/${r.id}`,
    })),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const kindIcon = (kind: string) => {
    switch (kind) {
      case 'property':
        return <Building2 className="h-5 w-5 text-muted-foreground" />;
      case 'service':
        return <Wrench className="h-5 w-5 text-muted-foreground" />;
      case 'restaurant':
        return <UtensilsCrossed className="h-5 w-5 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const isLoading = loadingProperties || loadingServices || loadingRestaurants;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
        <p className="mt-1 text-muted-foreground">
          {user.firstName
            ? `${user.firstName} ${user.lastName ?? ''}`
            : user.email}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('dashboard.stats.totalCazari')}</p>
              <p className="text-2xl font-bold">
                {loadingProperties ? '-' : propertiesData?.total ?? 0}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Wrench className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('dashboard.stats.totalServicii')}</p>
              <p className="text-2xl font-bold">
                {loadingServices ? '-' : servicesData?.total ?? 0}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
              <UtensilsCrossed className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('dashboard.stats.totalRestaurante')}</p>
              <p className="text-2xl font-bold">
                {loadingRestaurants ? '-' : restaurantsData?.total ?? 0}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 flex flex-wrap gap-3">
        <Link href="/dashboard/cazari/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('dashboard.addCazare')}
          </Button>
        </Link>
        <Link href="/dashboard/servicii/new">
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            {t('dashboard.addServiciu')}
          </Button>
        </Link>
        <Link href="/dashboard/restaurante/new">
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            {t('dashboard.addRestaurant')}
          </Button>
        </Link>
      </div>

      {/* Recent Listings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('dashboard.recentListings')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-md" />
              ))}
            </div>
          ) : recentItems.length === 0 ? (
            <div className="py-12 text-center">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">
                {t('dashboard.noListings')}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {recentItems.map((item) => (
                <div
                  key={`${item.kind}-${item.id}`}
                  className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-16 overflow-hidden rounded-md bg-muted">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          {kindIcon(item.kind)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.extra}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={statusBadgeVariant(item.status)}>
                      {t(`propertyStatus.${item.status}`)}
                    </Badge>
                    <Link href={item.viewUrl}>
                      <Button variant="ghost" size="sm" title={t('ownerPreview.previewLink')}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={item.editUrl}>
                      <Button variant="ghost" size="sm">
                        <FileEdit className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
