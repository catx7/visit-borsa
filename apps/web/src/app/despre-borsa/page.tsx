'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { History, MapPin, TreePine, Sparkles, Church, Mountain, Users, Ruler } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const HERO_IMAGE = '/images/despre-borsa1.jpg';

const SECTION_IMAGES: Record<string, string> = {
  history: '/images/despre-borsa-2.jpg',
  geography: '/images/despre-borsa3.jpeg',
  nature: '/images/despre-borsa4.jpeg',
  traditions: '/images/despre-borsa-5.jpeg',
  landmarks: '/images/despre-borsa1.jpg',
};

const SECTIONS = [
  { key: 'history', icon: History },
  { key: 'geography', icon: MapPin },
  { key: 'nature', icon: TreePine },
  { key: 'traditions', icon: Sparkles },
  { key: 'landmarks', icon: Church },
] as const;

export default function DespreBorsaPage() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-72 sm:h-96 overflow-hidden">
        <Image
          src={HERO_IMAGE}
          alt="Borșa, Maramureș"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-primary/80 via-primary/40 to-primary/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-display text-4xl text-white sm:text-5xl drop-shadow-lg">
            {t('aboutBorsa.title')}
          </h1>
          <p className="mt-5 text-lg text-white/85 max-w-2xl sm:text-xl leading-relaxed">
            {t('aboutBorsa.subtitle')}
          </p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="relative -mt-12 z-10 mx-auto max-w-4xl px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Mountain, label: t('aboutBorsa.statsAltitude') },
            { icon: Users, label: t('aboutBorsa.statsPopulation') },
            { icon: Ruler, label: t('aboutBorsa.statsSurface') },
          ].map((stat, i) => (
            <Card key={i} className="border-0 shadow-lg">
              <CardContent className="flex items-center gap-3 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <stat.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold text-foreground">{stat.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Content Sections */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-24">
        {SECTIONS.map(({ key, icon: Icon }, index) => {
          const isEven = index % 2 === 0;
          return (
            <section key={key} className="scroll-mt-20">
              <div className={`flex flex-col gap-10 lg:flex-row lg:items-center ${!isEven ? 'lg:flex-row-reverse' : ''}`}>
                {/* Image */}
                <div className="lg:w-1/2">
                  <div className="relative aspect-4/3 overflow-hidden rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)]">
                    <Image
                      src={SECTION_IMAGES[key]}
                      alt={t(`aboutBorsa.${key}`)}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                  </div>
                </div>

                {/* Text */}
                <div className="lg:w-1/2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="font-display text-2xl tracking-tight sm:text-3xl">
                      {t(`aboutBorsa.${key}`)}
                    </h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {t(`aboutBorsa.${key}Text`)}
                  </p>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
