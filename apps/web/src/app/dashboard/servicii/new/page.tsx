'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { Loader2, Upload, X, Eye, ArrowLeft } from 'lucide-react';
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

export default function NewServiciuPage() {
  const { t } = useTranslation();
  const router = useRouter();
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
  const [createdId, setCreatedId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const createMutation = useMutation({
    mutationFn: () =>
      api.createService(token!, {
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
    onSuccess: (service) => {
      setCreatedId(service.id);
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(t('propertyForm.createError'));
      }
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !token) return;

    const remaining = 3 - images.length;
    if (remaining <= 0) return;

    const filesToUpload = Array.from(files).slice(0, remaining);

    setUploading(true);
    try {
      const urls = await api.uploadImages(token, filesToUpload);
      setImages((prev) => [...prev, ...urls]);
    } catch {
      setError(t('propertyForm.createError'));
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
    if (images.length === 0) {
      setError(t('propertyForm.minImagesError'));
      return;
    }
    createMutation.mutate();
  };

  if (authLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="mb-8 h-10 w-64" />
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  if (!user) return null;

  if (createdId) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold">{t('ownerPreview.pendingTitle')}</h2>
            <p className="text-sm text-muted-foreground">{t('ownerPreview.previewMessage')}</p>
            <div className="flex flex-col gap-3 pt-2">
              <Link href={`/servicii/${createdId}`}>
                <Button className="w-full">
                  <Eye className="mr-2 h-4 w-4" />
                  {t('ownerPreview.previewLink')}
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t('ownerPreview.backToDashboard')}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold">{t('dashboard.addServiciu')}</h1>

      {error && (
        <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
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
                disabled={createMutation.isPending}
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
                disabled={createMutation.isPending}
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
                  disabled={createMutation.isPending}
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
                  disabled={createMutation.isPending}
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
                  disabled={createMutation.isPending}
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
                  disabled={createMutation.isPending}
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
                disabled={createMutation.isPending}
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
              {t('propertyForm.imagesCount', { count: images.length, max: 3 })}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {images.length < 3 && (
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
                  disabled={uploading || createMutation.isPending}
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
          <Button type="submit" disabled={createMutation.isPending || uploading}>
            {createMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('propertyForm.creating')}
              </>
            ) : (
              t('form.submit')
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard')}
            disabled={createMutation.isPending}
          >
            {t('form.cancel')}
          </Button>
        </div>
      </form>
    </div>
  );
}
