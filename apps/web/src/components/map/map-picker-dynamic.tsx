'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const MapPicker = dynamic(() => import('./map-picker'), {
  ssr: false,
  loading: () => <Skeleton className="h-72 w-full rounded-2xl" />,
});

export { MapPicker as MapPickerDynamic };
