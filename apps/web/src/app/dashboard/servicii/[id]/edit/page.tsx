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

const SERVICE_CATEGORIES = [
  'ATV', 'SNOWMOBILE', 'HORSEBACK_RIDING', 'HIKING',
  'SKIING', 'BICYCLE_RENTAL', 'RAFTING',
  'TAXI_LOCAL', 'RENT_A_CAR', 'FOTOGRAF', 'INSTALATOR',
  'ELECTRICIAN', 'TRANSPORT_MARFA', 'DESZAPEZIRE',
  'MASAJ', 'INSTRUCTOR_FITNESS', 'DJ', 'MUZICA_LIVE', 'CATERING',
  'OTHER',
] as const;

export default function EditServiciuPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const { user, token, isLoading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [category, setCategory] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [priceInfo, setPriceInfo] = useState('');
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
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

  const { data: service, isLoading: loadingService } = useQuery({
    queryKey: ['service', id],
    queryFn: () => api.getServiceById(id),
    enabled: !!id,
  });

  // Populate form when data loads
  useEffect(() => {
    if (service && !populated) {
      setCategory(service.category);
      setTitle(service.titleRo);
      setDescription(service.descriptionRo);
      setPhone(service.phone ?? '');
      setEmail(service.email ?? '');
      setWebsite(service.website ?? '');
      setAddress(service.address ?? '');
      setPriceInfo(service.priceInfo ?? '');
      setLatitude(service.latitude ?? undefined);
      setLongitude(service.longitude ?? undefined);
      setImages(service.images ?? []);
      setPopulated(true);
    }
  }, [service, populated]);

  const updateMutation = useMutation({
    mutationFn: () =>
      api.updateService(token!, id, {
        category,
        titleRo: title,
        titleEn: title,
        descriptionRo: description,
        descriptionEn: description,
        phone: phone || undefined,
        email: email || undefined,
        website: website || undefined,
        address: address || undefined,
        priceInfo: priceInfo || undefined,
        latitude,
        longitude,
        images,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service', id] });
      queryClient.invalidateQueries({ queryKey: ['my-services'] });
      setSuccess(t('propertyForm.updated'));
      setError('');
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(t('propertyForm.updateError'));
      }
    },
  });

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

  if (authLoading || loadingService) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="mb-8 h-10 w-64" />
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  if (!user) return null;

  if (!service) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 text-center sm:px-6 lg:px-8">
        <p className="text-muted-foreground">{t('propertyForm.notFound')}</p>
      </div>
    );
  }

  if (service.ownerId !== user.id) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 text-center sm:px-6 lg:px-8">
        <p className="text-destructive">{t('propertyForm.notOwner')}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold">{t('dashboard.editServiciu')}</h1>

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
              <label htmlFor="category" className="text-sm font-medium">
                {t('services.category')}
              </label>
              <Select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">{t('serviceForm.selectCategory')}</option>
                {SERVICE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {t(`serviceCategories.${cat}`)}
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

        {/* Contact & Location */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('propertyForm.location')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  {t('serviceForm.phone')}
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+40 7XX XXX XXX"
                  disabled={updateMutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  {t('serviceForm.email')}
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={updateMutation.isPending}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="website" className="text-sm font-medium">
                  {t('serviceForm.website')}
                </label>
                <Input
                  id="website"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://"
                  disabled={updateMutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="priceInfo" className="text-sm font-medium">
                  {t('serviceForm.priceInfo')}
                </label>
                <Input
                  id="priceInfo"
                  value={priceInfo}
                  onChange={(e) => setPriceInfo(e.target.value)}
                  disabled={updateMutation.isPending}
                />
              </div>
            </div>
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
