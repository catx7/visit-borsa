'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Star, MapPin, Check, Utensils, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/auth-context';
import { getLocalizedField } from '@/lib/utils';
import * as api from '@/lib/api';

type EntityType = 'PROPERTY' | 'SERVICE' | 'RESTAURANT' | 'ATTRACTION';

export default function AdminPromovatePage() {
  const { token } = useAuth();
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const locale = i18n.language;

  const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedRestaurantIds, setSelectedRestaurantIds] = useState<string[]>([]);
  const [selectedLocationEntity, setSelectedLocationEntity] = useState<{ type: EntityType; id: string } | null>(null);

  // Fetch approved items
  const { data: propertiesData, isLoading: propertiesLoading } = useQuery({
    queryKey: ['admin-approved-properties'],
    queryFn: () => api.getProperties({ status: 'APPROVED', limit: 100 }),
    enabled: !!token,
  });

  const { data: servicesData, isLoading: servicesLoading } = useQuery({
    queryKey: ['admin-approved-services'],
    queryFn: () => api.getServices({ status: 'APPROVED', limit: 100 }),
    enabled: !!token,
  });

  const { data: restaurantsData, isLoading: restaurantsLoading } = useQuery({
    queryKey: ['admin-approved-restaurants'],
    queryFn: () => api.getRestaurants({ status: 'APPROVED', limit: 100 }),
    enabled: !!token,
  });

  const { data: attractionsData, isLoading: attractionsLoading } = useQuery({
    queryKey: ['admin-attractions-all'],
    queryFn: () => api.getAttractions(1, 100),
    enabled: !!token,
  });

  // Fetch currently promoted
  const { data: promotedProperties } = useQuery({
    queryKey: ['promoted-properties'],
    queryFn: () => api.getPromotedProperties(),
    enabled: !!token,
  });

  const { data: promotedServices } = useQuery({
    queryKey: ['promoted-services'],
    queryFn: () => api.getPromotedServices(),
    enabled: !!token,
  });

  const { data: promotedRestaurants } = useQuery({
    queryKey: ['promoted-restaurants'],
    queryFn: () => api.getPromotedRestaurants(),
    enabled: !!token,
  });

  const { data: locationOfMonth } = useQuery({
    queryKey: ['location-of-month'],
    queryFn: () => api.getLocationOfMonth(),
    enabled: !!token,
  });

  // Initialize selections from fetched data
  useEffect(() => {
    if (promotedProperties) setSelectedPropertyIds(promotedProperties.map((p) => p.id));
  }, [promotedProperties]);

  useEffect(() => {
    if (promotedServices) setSelectedServiceIds(promotedServices.map((s) => s.id));
  }, [promotedServices]);

  useEffect(() => {
    if (promotedRestaurants) setSelectedRestaurantIds(promotedRestaurants.map((r) => r.id));
  }, [promotedRestaurants]);

  useEffect(() => {
    if (locationOfMonth) {
      setSelectedLocationEntity({ type: locationOfMonth.type, id: locationOfMonth.entity.id });
    }
  }, [locationOfMonth]);

  // Mutations
  const promotedPropertiesMutation = useMutation({
    mutationFn: (ids: string[]) => api.setPromotedProperties(token!, ids),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['promoted-properties'] }),
  });

  const promotedServicesMutation = useMutation({
    mutationFn: (ids: string[]) => api.setPromotedServices(token!, ids),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['promoted-services'] }),
  });

  const promotedRestaurantsMutation = useMutation({
    mutationFn: (ids: string[]) => api.setPromotedRestaurants(token!, ids),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['promoted-restaurants'] }),
  });

  const locationMutation = useMutation({
    mutationFn: (data: { type: string; id: string }) => api.setLocationOfMonth(token!, data.type, data.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['location-of-month'] }),
  });

  // Toggle helpers
  const toggleSelection = (
    id: string,
    setSelected: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((pid) => pid !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  // Reusable promoted section
  function PromotedSection({
    icon,
    title,
    description,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items,
    isLoading,
    selectedIds,
    setSelectedIds,
    mutation,
    renderSubtitle,
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: any[] | undefined;
    isLoading: boolean;
    selectedIds: string[];
    setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
    mutation: { mutate: (ids: string[]) => void; isPending: boolean; isSuccess: boolean };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderSubtitle: (item: any) => string;
  }) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <Badge variant="outline">
              {t('admin.promoted.selected', { count: selectedIds.length })} / 3
            </Badge>
            <Button
              onClick={() => mutation.mutate(selectedIds)}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? t('admin.promoted.saving') : t('admin.promoted.save')}
              {mutation.isSuccess && <Check className="ml-2 h-4 w-4" />}
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : (
            <div className="max-h-96 space-y-2 overflow-y-auto">
              {items?.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                const isDisabled = !isSelected && selectedIds.length >= 3;
                return (
                  <label
                    key={item.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : isDisabled
                          ? 'cursor-not-allowed border-border opacity-50'
                          : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelection(item.id, setSelectedIds)}
                      disabled={isDisabled}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    {item.images?.[0] && (
                      <img src={item.images[0]} alt="" className="h-10 w-10 rounded object-cover" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {getLocalizedField(item, 'title', locale)}
                      </p>
                      <p className="text-xs text-muted-foreground">{renderSubtitle(item)}</p>
                    </div>
                    {isSelected && (
                      <Badge variant="default" className="shrink-0">
                        #{selectedIds.indexOf(item.id) + 1}
                      </Badge>
                    )}
                  </label>
                );
              })}
              {(!items || items.length === 0) && (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  {t('common.error')}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // All entities for location of month selection
  const allEntities: { type: EntityType; id: string; label: string; subtitle: string; image?: string }[] = [
    ...(propertiesData?.data ?? []).map((p) => ({
      type: 'PROPERTY' as EntityType,
      id: p.id,
      label: getLocalizedField(p, 'title', locale),
      subtitle: t(`propertyTypes.${p.type}`),
      image: p.images?.[0],
    })),
    ...(servicesData?.data ?? []).map((s) => ({
      type: 'SERVICE' as EntityType,
      id: s.id,
      label: getLocalizedField(s, 'title', locale),
      subtitle: t(`serviceCategories.${s.category}`),
      image: s.images?.[0],
    })),
    ...(restaurantsData?.data ?? []).map((r) => ({
      type: 'RESTAURANT' as EntityType,
      id: r.id,
      label: getLocalizedField(r, 'title', locale),
      subtitle: t(`priceRanges.${r.priceRange}`),
      image: r.images?.[0],
    })),
    ...(attractionsData?.data ?? []).map((a) => ({
      type: 'ATTRACTION' as EntityType,
      id: a.id,
      label: getLocalizedField(a, 'title', locale),
      subtitle: `${a.latitude.toFixed(4)}, ${a.longitude.toFixed(4)}`,
      image: a.images?.[0],
    })),
  ];

  const typeLabels: Record<EntityType, string> = {
    PROPERTY: t('nav.cazari'),
    SERVICE: t('nav.servicii'),
    RESTAURANT: t('nav.restaurante'),
    ATTRACTION: t('nav.deVizitat'),
  };

  const locationLoading = propertiesLoading || servicesLoading || restaurantsLoading || attractionsLoading;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">{t('admin.promoted.title')}</h1>

      {/* Promoted Properties */}
      <PromotedSection
        icon={<Star className="h-5 w-5 text-amber-500" />}
        title={t('admin.promoted.properties')}
        description={t('admin.promoted.propertiesDesc')}
        items={propertiesData?.data}
        isLoading={propertiesLoading}
        selectedIds={selectedPropertyIds}
        setSelectedIds={setSelectedPropertyIds}
        mutation={promotedPropertiesMutation}
        renderSubtitle={(item) => `${t(`propertyTypes.${item.type}`)} · ${item.owner?.email ?? ''}`}
      />

      {/* Promoted Services */}
      <PromotedSection
        icon={<Compass className="h-5 w-5 text-blue-500" />}
        title={t('admin.promoted.services')}
        description={t('admin.promoted.servicesDesc')}
        items={servicesData?.data}
        isLoading={servicesLoading}
        selectedIds={selectedServiceIds}
        setSelectedIds={setSelectedServiceIds}
        mutation={promotedServicesMutation}
        renderSubtitle={(item) => t(`serviceCategories.${item.category}`)}
      />

      {/* Promoted Restaurants */}
      <PromotedSection
        icon={<Utensils className="h-5 w-5 text-orange-500" />}
        title={t('admin.promoted.restaurants')}
        description={t('admin.promoted.restaurantsDesc')}
        items={restaurantsData?.data}
        isLoading={restaurantsLoading}
        selectedIds={selectedRestaurantIds}
        setSelectedIds={setSelectedRestaurantIds}
        mutation={promotedRestaurantsMutation}
        renderSubtitle={(item) => t(`priceRanges.${item.priceRange}`)}
      />

      {/* Location of the Month */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">{t('admin.promoted.locationOfMonth')}</CardTitle>
          </div>
          <CardDescription>{t('admin.promoted.locationOfMonthDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {t('admin.promoted.currentLocation')}:{' '}
              {locationOfMonth ? (
                <span className="font-medium text-foreground">
                  {getLocalizedField(locationOfMonth.entity, 'title', locale)} ({typeLabels[locationOfMonth.type]})
                </span>
              ) : (
                <span className="italic">{t('admin.promoted.noLocation')}</span>
              )}
            </div>
            <Button
              onClick={() => {
                if (selectedLocationEntity) {
                  locationMutation.mutate({ type: selectedLocationEntity.type, id: selectedLocationEntity.id });
                }
              }}
              disabled={locationMutation.isPending || !selectedLocationEntity}
            >
              {locationMutation.isPending ? t('admin.promoted.saving') : t('admin.promoted.save')}
              {locationMutation.isSuccess && <Check className="ml-2 h-4 w-4" />}
            </Button>
          </div>

          {locationLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : (
            <div className="max-h-128 space-y-2 overflow-y-auto">
              {(['PROPERTY', 'SERVICE', 'RESTAURANT', 'ATTRACTION'] as EntityType[]).map((entityType) => {
                const entities = allEntities.filter((e) => e.type === entityType);
                if (entities.length === 0) return null;
                return (
                  <div key={entityType}>
                    <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground first:mt-0">
                      {typeLabels[entityType]}
                    </p>
                    {entities.map((entity) => {
                      const isSelected = selectedLocationEntity?.type === entity.type && selectedLocationEntity?.id === entity.id;
                      return (
                        <label
                          key={`${entity.type}-${entity.id}`}
                          className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors mb-2 ${
                            isSelected
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="locationOfMonth"
                            checked={isSelected}
                            onChange={() => setSelectedLocationEntity({ type: entity.type, id: entity.id })}
                            className="h-4 w-4 border-border text-primary focus:ring-primary"
                          />
                          {entity.image && (
                            <img src={entity.image} alt="" className="h-10 w-10 rounded object-cover" />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{entity.label}</p>
                            <p className="text-xs text-muted-foreground">{entity.subtitle}</p>
                          </div>
                          {isSelected && (
                            <Badge variant="outline" className="shrink-0">
                              {t('attractions.locationOfMonth')}
                            </Badge>
                          )}
                        </label>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
