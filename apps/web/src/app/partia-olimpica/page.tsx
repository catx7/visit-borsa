'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import {
  Mountain,
  Ruler,
  Gauge,
  CableCar,
  Snowflake,
  Phone,
  Globe,
  Video,
  ArrowUpDown,
  Users,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const SLOPE_IMAGES: Record<string, string> = {
  olimpica: '/images/partia-telegondola.jpg',
  cascada: '/images/partia-cascada.jpg',
  prislop: '/images/partia-prislop.jpg',
};

const HERO_IMAGE = '/images/hero-ski.jpg';

interface SlopeSpec {
  icon: React.ElementType;
  labelKey: string;
  valueKey: string;
}

const OLIMPICA_SPECS: SlopeSpec[] = [
  { icon: Mountain, labelKey: 'skiSlopes.altitudeLabel', valueKey: 'skiSlopes.olimpica.altitude' },
  { icon: Ruler, labelKey: 'skiSlopes.lengthLabel', valueKey: 'skiSlopes.olimpica.length' },
  { icon: Gauge, labelKey: 'skiSlopes.difficultyLabel', valueKey: 'skiSlopes.olimpica.difficulty' },
  { icon: CableCar, labelKey: 'skiSlopes.liftLabel', valueKey: 'skiSlopes.olimpica.lift' },
  { icon: Users, labelKey: 'skiSlopes.capacityLabel', valueKey: 'skiSlopes.olimpica.capacity' },
  { icon: Snowflake, labelKey: 'skiSlopes.snowCannonsLabel', valueKey: 'skiSlopes.olimpica.snowCannons' },
];

const CASCADA_SPECS: SlopeSpec[] = [
  { icon: Mountain, labelKey: 'skiSlopes.altitudeLabel', valueKey: 'skiSlopes.cascada.altitude' },
  { icon: Ruler, labelKey: 'skiSlopes.lengthLabel', valueKey: 'skiSlopes.cascada.length' },
  { icon: Gauge, labelKey: 'skiSlopes.difficultyLabel', valueKey: 'skiSlopes.cascada.difficulty' },
  { icon: CableCar, labelKey: 'skiSlopes.liftLabel', valueKey: 'skiSlopes.cascada.lift' },
];

const PRISLOP_SPECS: SlopeSpec[] = [
  { icon: Mountain, labelKey: 'skiSlopes.altitudeLabel', valueKey: 'skiSlopes.prislop.altitude' },
  { icon: Ruler, labelKey: 'skiSlopes.lengthLabel', valueKey: 'skiSlopes.prislop.length' },
  { icon: Gauge, labelKey: 'skiSlopes.difficultyLabel', valueKey: 'skiSlopes.prislop.difficulty' },
  { icon: CableCar, labelKey: 'skiSlopes.liftLabel', valueKey: 'skiSlopes.prislop.lift' },
];

function SlopeCard({
  slopeKey,
  specs,
  image,
  contactKey,
  websiteKey,
  t,
}: {
  slopeKey: string;
  specs: SlopeSpec[];
  image: string;
  contactKey?: string;
  websiteKey?: string;
  t: (key: string) => string;
}) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      {/* Image */}
      <div className="relative h-56 sm:h-64 overflow-hidden">
        <Image
          src={image}
          alt={t(`skiSlopes.${slopeKey}.name`)}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-2xl font-bold text-white">{t(`skiSlopes.${slopeKey}.name`)}</h3>
          <p className="text-white/80 text-sm mt-1">{t(`skiSlopes.${slopeKey}.subtitle`)}</p>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Description */}
        <p className="text-muted-foreground leading-relaxed text-sm">
          {t(`skiSlopes.${slopeKey}.description`)}
        </p>

        {/* Specs Grid */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {specs.map((spec) => {
            const Icon = spec.icon;
            return (
              <div key={spec.valueKey} className="flex items-start gap-2.5 rounded-xl bg-secondary/70 p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">{t(spec.labelKey)}</div>
                  <div className="text-sm font-semibold mt-0.5 truncate">{t(spec.valueKey)}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact/Website */}
        {(contactKey || websiteKey) && (
          <div className="mt-5 flex flex-wrap gap-3 pt-4 border-t border-border">
            {contactKey && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>{t(contactKey)}</span>
              </div>
            )}
            {websiteKey && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4 text-primary" />
                <span>{t(websiteKey)}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const LIVECAMS = [
  { slopeKey: 'olimpica', envUrl: process.env.NEXT_PUBLIC_LIVECAM_OLIMPICA_URL },
  { slopeKey: 'cascada', envUrl: process.env.NEXT_PUBLIC_LIVECAM_CASCADA_URL },
  { slopeKey: 'prislop', envUrl: process.env.NEXT_PUBLIC_LIVECAM_PRISLOP_URL },
];

export default function PartiaOlimpicaPage() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero */}
      <section className="relative h-64 sm:h-80 overflow-hidden">
        <Image
          src={HERO_IMAGE}
          alt={t('skiSlopes.title')}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-primary/80 via-primary/40 to-primary/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm mb-4">
            <Mountain className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-5xl drop-shadow-md">
            {t('skiSlopes.title')}
          </h1>
          <p className="mt-3 text-lg text-white/85 max-w-2xl">
            {t('skiSlopes.subtitle')}
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-muted-foreground leading-relaxed text-lg">
            {t('skiSlopes.description')}
          </p>
        </div>
      </section>

      {/* Three Slopes */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ArrowUpDown className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">{t('skiSlopes.features')}</h2>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <SlopeCard
              slopeKey="olimpica"
              specs={OLIMPICA_SPECS}
              image={SLOPE_IMAGES.olimpica}
              contactKey="skiSlopes.olimpica.contact"
              websiteKey="skiSlopes.olimpica.website"
              t={t}
            />
            <SlopeCard
              slopeKey="cascada"
              specs={CASCADA_SPECS}
              image={SLOPE_IMAGES.cascada}
              websiteKey="skiSlopes.cascada.website"
              t={t}
            />
            <SlopeCard
              slopeKey="prislop"
              specs={PRISLOP_SPECS}
              image={SLOPE_IMAGES.prislop}
              t={t}
            />
          </div>
        </div>
      </section>

      {/* Live Cams */}
      <section className="py-16 bg-secondary/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-500">
              <Video className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold">{t('skiSlopes.liveCam')}</h2>
          </div>
          <p className="text-center text-muted-foreground mb-10">{t('skiSlopes.liveCamDesc')}</p>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {LIVECAMS.map(({ slopeKey, envUrl }) => (
              <div key={slopeKey}>
                <h3 className="text-lg font-semibold mb-3 text-center">
                  {t(`skiSlopes.${slopeKey}.name`)}
                </h3>
                {envUrl ? (
                  <div className="aspect-video overflow-hidden rounded-2xl border border-border shadow-lg">
                    <iframe
                      src={envUrl}
                      title={t(`skiSlopes.${slopeKey}.name`)}
                      className="h-full w-full"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <Card className="border-0 shadow-lg">
                    <CardContent className="flex aspect-video items-center justify-center p-6">
                      <div className="text-center text-muted-foreground">
                        <Video className="mx-auto h-10 w-10 mb-3 text-muted-foreground/50" />
                        <p className="text-sm font-medium">{t('skiSlopes.liveCamDesc')}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
