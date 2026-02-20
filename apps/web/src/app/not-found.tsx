'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
      <p className="mt-4 text-xl text-muted-foreground">{t('common.notFound')}</p>
      <Link href="/" className="mt-8">
        <Button>
          <Home className="mr-2 h-4 w-4" />
          {t('common.backHome')}
        </Button>
      </Link>
    </div>
  );
}
