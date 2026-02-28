'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { MapPin, Mail, Mountain } from 'lucide-react';

export function Footer() {
  const { t, i18n } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <Image src="/images/logo.png" alt={t('site.name')} width={56} height={56} className="rounded-xl" />
              <span className="font-display text-xl tracking-tight">{t('site.name')}</span>
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
                <span>stetco.catalin7@gmail.com</span>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <a href="https://www.facebook.com/visitborsa" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
              <a href="https://www.instagram.com/visitborsa.ro" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </a>
              <a href="https://www.tiktok.com/@visit_borsa" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13.2a8.16 8.16 0 005.58 2.17v-3.44a4.85 4.85 0 01-2.43-.65 4.83 4.83 0 01-1.57-4.59z" /></svg>
              </a>
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
        <div className="mt-14 border-t border-white/10 pt-8 flex flex-col items-center gap-2 text-sm text-white/50">
          <span>&copy; {year} {t('site.name')}. {t('footer.rights')}.</span>
          <div className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" />
            <a href="mailto:stetco.catalin7@gmail.com" className="hover:text-white transition-colors">
              stetco.catalin7@gmail.com
            </a>
          </div>
          <span>Made with &hearts; by CTX ( STET&CO TECHNOLOGY )</span>
        </div>
      </div>
    </footer>
  );
}
