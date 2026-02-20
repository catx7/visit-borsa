'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  Users,
  Building2,
  Clock,
  Wrench,
  UtensilsCrossed,
  MapPin,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/auth-context';
import type { AdminStats } from '@/lib/api';
import * as api from '@/lib/api';

type StatCard = {
  key: keyof AdminStats;
  icon: typeof Users;
  labelKey: string;
  color: string;
  bgColor: string;
  isPending?: boolean;
};

const statCards: StatCard[] = [
  { key: 'totalUsers', icon: Users, labelKey: 'admin.stats.totalUsers', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { key: 'totalProperties', icon: Building2, labelKey: 'admin.stats.totalProperties', color: 'text-green-600', bgColor: 'bg-green-50' },
  { key: 'pendingProperties', icon: Clock, labelKey: 'admin.stats.pendingProperties', color: 'text-amber-600', bgColor: 'bg-amber-50', isPending: true },
  { key: 'totalServices', icon: Wrench, labelKey: 'admin.stats.totalServices', color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  { key: 'pendingServices', icon: Clock, labelKey: 'admin.stats.pendingServices', color: 'text-amber-600', bgColor: 'bg-amber-50', isPending: true },
  { key: 'totalRestaurants', icon: UtensilsCrossed, labelKey: 'admin.stats.totalRestaurants', color: 'text-orange-600', bgColor: 'bg-orange-50' },
  { key: 'pendingRestaurants', icon: Clock, labelKey: 'admin.stats.pendingRestaurants', color: 'text-amber-600', bgColor: 'bg-amber-50', isPending: true },
  { key: 'totalAttractions', icon: MapPin, labelKey: 'admin.stats.totalAttractions', color: 'text-purple-600', bgColor: 'bg-purple-50' },
];

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const { t } = useTranslation();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.getAdminStats(token!),
    enabled: !!token,
  });

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">{t('admin.dashboard.title')}</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.key} className={card.isPending ? 'border-amber-200' : ''}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t(card.labelKey)}
              </CardTitle>
              <div className={`rounded-md p-2 ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <p className={`text-3xl font-bold ${card.isPending ? 'text-amber-600' : ''}`}>
                  {stats?.[card.key] ?? 0}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
