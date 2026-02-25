'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Upload, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import * as api from '@/lib/api';
import { ApiError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPickerDynamic } from '@/components/map/map-picker-dynamic';

const PROPERTY_TYPES = ['HOTEL', 'VILA', 'PENSIUNE', 'CABANA', 'APARTAMENT', 'CAMERA', 'CASA_VACANTA'] as const;

const AMENITIES = [
  'wifi', 'parking', 'pool', 'spa', 'restaurant', 'room-service',
  'gym', 'garden', 'bbq', 'mountain-view', 'fireplace', 'terrace',
  'ski-access', 'breakfast', 'air-conditioning', 'bar', 'traditional-style',
];

const MEAL_POLICIES = ['NONE', 'INCLUDED', 'EXTRA_COST'] as const;
const PAYMENT_METHODS = ['CASH', 'BANK_TRANSFER', 'CARD', 'ONLINE'] as const;
const PAID_EXTRAS = ['hot_tub', 'sauna', 'pool', 'spa', 'jacuzzi', 'massage', 'gym', 'bicycle_rental'] as const;

export default function EditCazarePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const { user, token, isLoading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [type, setType] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [pricePerNight, setPricePerNight] = useState('');
  const [rooms, setRooms] = useState('');
  const [maxGuests, setMaxGuests] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [mealPolicy, setMealPolicy] = useState('NONE');
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [depositRequired, setDepositRequired] = useState(false);
  const [depositPolicyRo, setDepositPolicyRo] = useState('');
  const [depositPolicyEn, setDepositPolicyEn] = useState('');
  const [priceWholeUnit, setPriceWholeUnit] = useState('');
  const [paidExtras, setPaidExtras] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [populated, setPopulated] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const { data: property, isLoading: loadingProperty } = useQuery({
    queryKey: ['property', id],
    queryFn: () => api.getPropertyById(id),
    enabled: !!id,
  });

  // Populate form when property data loads
  useEffect(() => {
    if (property && !populated) {
      setType(property.type);
      setTitle(property.titleRo);
      setDescription(property.descriptionRo);
      setAddress(property.address ?? '');
      setLatitude(property.latitude ?? undefined);
      setLongitude(property.longitude ?? undefined);
      setPricePerNight(property.pricePerNight?.toString() ?? '');
      setRooms(property.rooms?.toString() ?? '');
      setMaxGuests(property.maxGuests?.toString() ?? '');
      setAmenities(property.amenities ?? []);
      setMealPolicy(property.mealPolicy ?? 'NONE');
      setPaymentMethods(property.paymentMethods ?? []);
      setDepositRequired(property.depositRequired ?? false);
      setDepositPolicyRo(property.depositPolicyRo ?? '');
      setDepositPolicyEn(property.depositPolicyEn ?? '');
      setPriceWholeUnit(property.priceWholeUnit?.toString() ?? '');
      setPaidExtras(property.paidExtras ?? []);
      setImages(property.images ?? []);
      setPopulated(true);
    }
  }, [property, populated]);

  // Verify ownership
  useEffect(() => {
    if (property && user && property.ownerId !== user.id) {
      setError(t('propertyForm.notOwner'));
    }
  }, [property, user, t]);

  const updateMutation = useMutation({
    mutationFn: () =>
      api.updateProperty(token!, id, {
        type,
        titleRo: title,
        titleEn: title,
        descriptionRo: description,
        descriptionEn: description,
        address: address || undefined,
        latitude,
        longitude,
        pricePerNight: parseFloat(pricePerNight),
        rooms: parseInt(rooms, 10),
        maxGuests: parseInt(maxGuests, 10),
        amenities,
        mealPolicy,
        paymentMethods,
        depositRequired,
        depositPolicyRo: depositPolicyRo || undefined,
        depositPolicyEn: depositPolicyEn || undefined,
        priceWholeUnit: priceWholeUnit ? parseFloat(priceWholeUnit) : undefined,
        paidExtras,
        images,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property', id] });
      queryClient.invalidateQueries({ queryKey: ['my-properties'] });
      setSuccess(t('propertyForm.updated'));
      setError('');
      setTimeout(() => router.push(`/cazari/${id}`), 1500);
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(t('propertyForm.updateError'));
      }
    },
  });

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity],
    );
  };

  const togglePaymentMethod = (method: string) => {
    setPaymentMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method],
    );
  };

  const togglePaidExtra = (extra: string) => {
    setPaidExtras((prev) =>
      prev.includes(extra) ? prev.filter((e) => e !== extra) : [...prev, extra],
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !token) return;

    const remaining = 8 - images.length;
    if (remaining <= 0) return;

    const filesToUpload = Array.from(files).slice(0, remaining);

    setUploading(true);
    try {
      const urls = await api.uploadImages(token, filesToUpload);
      setImages((prev) => [...prev, ...urls]);
    } catch {
      setError(t('propertyForm.updateError'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    updateMutation.mutate();
  };

  if (authLoading || loadingProperty) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="mb-8 h-10 w-64" />
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  if (!user) return null;

  if (!property) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 text-center sm:px-6 lg:px-8">
        <p className="text-muted-foreground">{t('propertyForm.notFound')}</p>
      </div>
    );
  }

  if (property.ownerId !== user.id) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 text-center sm:px-6 lg:px-8">
        <p className="text-destructive">{t('propertyForm.notOwner')}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold">{t('dashboard.editCazare')}</h1>

      {error && (
        <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('propertyForm.basicInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                {t('properties.type')}
              </label>
              <Select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="">{t('propertyForm.selectType')}</option>
                {PROPERTY_TYPES.map((pt) => (
                  <option key={pt} value={pt}>
                    {t(`propertyTypes.${pt}`)}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                {t('propertyForm.title')}
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={updateMutation.isPending}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                {t('propertyForm.description')}
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                disabled={updateMutation.isPending}
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('propertyForm.location')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">
                {t('propertyForm.address')}
              </label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={updateMutation.isPending}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t('propertyForm.pickLocation')}
              </label>
              <MapPickerDynamic
                latitude={latitude}
                longitude={longitude}
                onLocationChange={(lat, lng) => {
                  setLatitude(lat);
                  setLongitude(lng);
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('propertyForm.details')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <label htmlFor="pricePerNight" className="text-sm font-medium">
                  {t('propertyForm.pricePerNight')}
                </label>
                <Input
                  id="pricePerNight"
                  type="number"
                  min="0"
                  value={pricePerNight}
                  onChange={(e) => setPricePerNight(e.target.value)}
                  required
                  disabled={updateMutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="priceWholeUnit" className="text-sm font-medium">
                  {t('propertyForm.priceWholeUnit')}
                </label>
                <Input
                  id="priceWholeUnit"
                  type="number"
                  min="0"
                  value={priceWholeUnit}
                  onChange={(e) => setPriceWholeUnit(e.target.value)}
                  placeholder={t('propertyForm.priceWholeUnitHint')}
                  disabled={updateMutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="rooms" className="text-sm font-medium">
                  {t('propertyForm.rooms')}
                </label>
                <Input
                  id="rooms"
                  type="number"
                  min="1"
                  value={rooms}
                  onChange={(e) => setRooms(e.target.value)}
                  required
                  disabled={updateMutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="maxGuests" className="text-sm font-medium">
                  {t('propertyForm.maxGuests')}
                </label>
                <Input
                  id="maxGuests"
                  type="number"
                  min="1"
                  value={maxGuests}
                  onChange={(e) => setMaxGuests(e.target.value)}
                  required
                  disabled={updateMutation.isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('propertyForm.amenities')}</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {AMENITIES.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center gap-2 rounded-md border border-border p-2 text-sm hover:bg-accent cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={amenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="rounded"
                      disabled={updateMutation.isPending}
                    />
                    {t(`amenityLabels.${amenity}`)}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="mealPolicy" className="text-sm font-medium">
                {t('propertyForm.mealPolicy')}
              </label>
              <Select
                id="mealPolicy"
                value={mealPolicy}
                onChange={(e) => setMealPolicy(e.target.value)}
                disabled={updateMutation.isPending}
              >
                {MEAL_POLICIES.map((mp) => (
                  <option key={mp} value={mp}>
                    {t(`mealPolicies.${mp}`)}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('propertyForm.paymentMethods')}</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method}
                    className="flex items-center gap-2 rounded-md border border-border p-2 text-sm hover:bg-accent cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={paymentMethods.includes(method)}
                      onChange={() => togglePaymentMethod(method)}
                      className="rounded"
                      disabled={updateMutation.isPending}
                    />
                    {t(`paymentMethodLabels.${method}`)}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={depositRequired}
                  onChange={(e) => setDepositRequired(e.target.checked)}
                  className="rounded"
                  disabled={updateMutation.isPending}
                />
                {t('propertyForm.depositRequired')}
              </label>
              {depositRequired && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
                  <div className="space-y-1">
                    <label htmlFor="depositPolicyRo" className="text-xs text-muted-foreground">
                      {t('propertyForm.depositPolicy')} (RO)
                    </label>
                    <Textarea
                      id="depositPolicyRo"
                      value={depositPolicyRo}
                      onChange={(e) => setDepositPolicyRo(e.target.value)}
                      rows={2}
                      placeholder={t('propertyForm.depositPolicyHint')}
                      disabled={updateMutation.isPending}
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="depositPolicyEn" className="text-xs text-muted-foreground">
                      {t('propertyForm.depositPolicy')} (EN)
                    </label>
                    <Textarea
                      id="depositPolicyEn"
                      value={depositPolicyEn}
                      onChange={(e) => setDepositPolicyEn(e.target.value)}
                      rows={2}
                      disabled={updateMutation.isPending}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('propertyForm.paidExtras')}</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {PAID_EXTRAS.map((extra) => (
                  <label
                    key={extra}
                    className="flex items-center gap-2 rounded-md border border-border p-2 text-sm hover:bg-accent cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={paidExtras.includes(extra)}
                      onChange={() => togglePaidExtra(extra)}
                      className="rounded"
                      disabled={updateMutation.isPending}
                    />
                    {t(`paidExtraLabels.${extra}`)}
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('propertyForm.images')}</CardTitle>
            <p className="text-xs text-muted-foreground">
              {t('propertyForm.imagesCount', { count: images.length, max: 8 })}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {images.length < 8 && (
              <div
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 transition-colors hover:border-primary/50"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {uploading ? t('form.uploading') : t('propertyForm.dragOrClick')}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading || updateMutation.isPending}
                />
              </div>
            )}
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {images.map((url, index) => (
                  <div key={index} className="group relative aspect-video overflow-hidden rounded-md">
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="submit" disabled={updateMutation.isPending || uploading}>
            {updateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('propertyForm.updating')}
              </>
            ) : (
              t('form.save')
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard')}
            disabled={updateMutation.isPending}
          >
            {t('form.cancel')}
          </Button>
        </div>
      </form>
    </div>
  );
}
