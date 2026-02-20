'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { MapPin, Mail, Mountain } from 'lucide-react';

export function Footer() {
  const { t, i18n } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 font-bold text-sm">
                VB
              </div>
              <span className="font-bold text-lg tracking-tight">{t('site.name')}</span>
            </div>
            <p className="mt-4 text-sm text-white/70 leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="mt-5 space-y-2.5">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>Borșa, Maramureș, Romania</span>
              </div>
<div className="flex items-center gap-2 text-sm text-white/60">
                <Mail className="h-4 w-4 shrink-0" />
                <span>info@visitborsa.ro</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">{t('footer.cazari')}</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/cazari?type=HOTEL" className="text-sm text-white/60 hover:text-white transition-colors">{t('propertyTypes.HOTEL')}</Link></li>
              <li><Link href="/cazari?type=PENSIUNE" className="text-sm text-white/60 hover:text-white transition-colors">{t('propertyTypes.PENSIUNE')}</Link></li>
              <li><Link href="/cazari?type=VILA" className="text-sm text-white/60 hover:text-white transition-colors">{t('propertyTypes.VILA')}</Link></li>
              <li><Link href="/cazari?type=CABANA" className="text-sm text-white/60 hover:text-white transition-colors">{t('propertyTypes.CABANA')}</Link></li>
              <li><Link href="/cazari?type=APARTAMENT" className="text-sm text-white/60 hover:text-white transition-colors">{t('propertyTypes.APARTAMENT')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">{t('footer.explore')}</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/servicii" className="text-sm text-white/60 hover:text-white transition-colors">{t('footer.servicii')}</Link></li>
              <li><Link href="/restaurante" className="text-sm text-white/60 hover:text-white transition-colors">{t('footer.restaurante')}</Link></li>
              <li><Link href="/de-vizitat" className="text-sm text-white/60 hover:text-white transition-colors">{t('nav.deVizitat')}</Link></li>
              <li><Link href="/despre-borsa" className="text-sm text-white/60 hover:text-white transition-colors">{t('nav.despreBorsa')}</Link></li>
              <li><Link href="/partia-olimpica" className="text-sm text-white/60 hover:text-white transition-colors">{t('nav.partiaOlimpica')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
              {i18n?.language === 'ro' ? 'Iarnă activă' : 'Active Winter'}
            </h3>
            <div className="mt-4 rounded-xl bg-white/10 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Mountain className="h-5 w-5 text-white/80" />
                <span className="text-sm font-medium">3 {i18n?.language === 'ro' ? 'pârtii de schi' : 'ski slopes'}</span>
              </div>
              <ul className="space-y-1.5 text-sm text-white/60">
                <li>Pârtia Olimpică</li>
                <li>Pârtia Cascada Cailor</li>
                <li>Pârtia Prislop</li>
              </ul>
              <Link
                href="/partia-olimpica"
                className="mt-3 inline-block text-sm font-medium text-white/90 hover:text-white underline underline-offset-2"
              >
                {t('home.viewAll')} &rarr;
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-white/15 pt-8 flex flex-col items-center gap-2 text-sm text-white/50">
          <span>&copy; {year} {t('site.name')}. {t('footer.rights')}.</span>
          <span>Made with &hearts; by CTX</span>
        </div>
      </div>
    </footer>
  );
}
