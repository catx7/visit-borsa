import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Servicii Turistice Borșa — ATV, Schi, Drumeții | VisitBorșa',
  description:
    'Servicii turistice în Borșa, Maramureș — ATV, snowmobile, drumeții, schi, călărie și multe altele în Munții Rodnei.',
  keywords: ['servicii turistice borsa', 'atv borsa', 'schi borsa', 'drumetii borsa', 'snowmobile borsa', 'activitati borsa'],
  openGraph: {
    title: 'Servicii Turistice Borșa — ATV, Schi, Drumeții',
    description: 'Servicii turistice în Borșa — ATV, snowmobile, drumeții, schi, călărie în Munții Rodnei.',
  },
};

export default function ServiciiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
