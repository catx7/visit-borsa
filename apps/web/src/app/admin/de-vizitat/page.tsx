'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Trash2, Edit, Plus, X, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/auth-context';
import { getLocalizedField } from '@/lib/utils';
import * as api from '@/lib/api';

interface AttractionFormData {
  titleRo: string;
  titleEn: string;
  descriptionRo: string;
  descriptionEn: string;
  latitude: string;
  longitude: string;
  images: string[];
}

const emptyForm: AttractionFormData = {
  titleRo: '',
  titleEn: '',
  descriptionRo: '',
  descriptionEn: '',
  latitude: '',
  longitude: '',
  images: [],
};

export default function AdminDeVizitatPage() {
  const { token } = useAuth();
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AttractionFormData>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const limit = 12;

  const locale = i18n.language;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-attractions', page],
    queryFn: () => api.getAttractions(page, limit),
  });

  const createMutation = useMutation({
    mutationFn: (formData: Record<string, unknown>) =>
      api.adminCreateAttraction(token!, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-attractions'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data: updateData }: { id: string; data: Record<string, unknown> }) =>
      api.adminUpdateAttraction(token!, id, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-attractions'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.adminDeleteAttraction(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-attractions'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  const resetForm = () => {
    setForm(emptyForm);
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (attraction: api.AttractionDto) => {
    setForm({
      titleRo: attraction.titleRo,
      titleEn: attraction.titleEn,
      descriptionRo: attraction.descriptionRo,
      descriptionEn: attraction.descriptionEn,
      latitude: String(attraction.latitude),
      longitude: String(attraction.longitude),
      images: attraction.images ?? [],
    });
    setEditingId(attraction.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('admin.attractions.confirmDelete'))) {
      deleteMutation.mutate(id);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !token) return;

    setUploading(true);
    try {
      const urls = await api.uploadImages(token, Array.from(files));
      setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch {
      // upload failed silently
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Record<string, unknown> = {
      titleRo: form.titleRo,
      titleEn: form.titleEn,
      descriptionRo: form.descriptionRo,
      descriptionEn: form.descriptionEn,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      images: form.images,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const updateField = (field: keyof AttractionFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('admin.attractions.title')}</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('admin.attractions.create')}
          </Button>
        )}
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg">
              {editingId
                ? t('admin.attractions.editTitle')
                : t('admin.attractions.createTitle')}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={resetForm}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  {t('admin.attractions.form.titleRo')}
                </label>
                <Input
                  value={form.titleRo}
                  onChange={(e) => updateField('titleRo', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  {t('admin.attractions.form.titleEn')}
                </label>
                <Input
                  value={form.titleEn}
                  onChange={(e) => updateField('titleEn', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  {t('admin.attractions.form.descriptionRo')}
                </label>
                <Textarea
                  value={form.descriptionRo}
                  onChange={(e) => updateField('descriptionRo', e.target.value)}
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  {t('admin.attractions.form.descriptionEn')}
                </label>
                <Textarea
                  value={form.descriptionEn}
                  onChange={(e) => updateField('descriptionEn', e.target.value)}
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  {t('admin.attractions.form.latitude')}
                </label>
                <Input
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={(e) => updateField('latitude', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  {t('admin.attractions.form.longitude')}
                </label>
                <Input
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={(e) => updateField('longitude', e.target.value)}
                  required
                />
              </div>

              {/* Images */}
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">
                  {t('admin.attractions.form.images')}
                </label>
                <div className="flex flex-wrap gap-3">
                  {form.images.map((url, i) => (
                    <div key={i} className="group relative">
                      <img
                        src={url}
                        alt={`Image ${i + 1}`}
                        className="h-20 w-20 rounded-md object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute -right-2 -top-2 hidden rounded-full bg-destructive p-1 text-destructive-foreground group-hover:block"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-border hover:border-primary">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    {uploading ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    ) : (
                      <Upload className="h-5 w-5 text-muted-foreground" />
                    )}
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="flex gap-2">
                  <Button type="submit" disabled={isMutating}>
                    {isMutating
                      ? t('admin.attractions.form.saving')
                      : editingId
                        ? t('admin.attractions.form.update')
                        : t('admin.attractions.form.create')}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    {t('admin.attractions.form.cancel')}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Attractions Table */}
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
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.attractions.col.title')}</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.attractions.col.coordinates')}</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.attractions.col.locationOfMonth')}</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.attractions.col.date')}</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">{t('admin.attractions.col.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data?.data.map((attraction) => (
                  <tr key={attraction.id} className="hover:bg-muted/30">
                    <td className="max-w-[250px] truncate px-4 py-3 font-medium">
                      {getLocalizedField(attraction, 'title', locale)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {attraction.latitude.toFixed(4)}, {attraction.longitude.toFixed(4)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {attraction.isLocationOfMonth && (
                        <Badge variant="default">{t('attractions.locationOfMonth')}</Badge>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {new Date(attraction.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => handleEdit(attraction)}
                          title={t('admin.attractions.edit')}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(attraction.id)}
                          disabled={deleteMutation.isPending}
                          title={t('admin.attractions.delete')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {data?.data.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      {t('admin.attractions.empty')}
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
