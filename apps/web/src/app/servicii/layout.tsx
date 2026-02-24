import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Servicii Turistice Borșa — ATV, Schi, Drumeții | VisitBorsa',
  description:
    'Servicii turistice în Borșa, Maramureș — ATV, snowmobile, drumeții, schi, călărie, rafting și multe altele în Munții Rodnei.',
  keywords: ['servicii turistice borsa', 'atv borsa', 'schi borsa', 'drumetii borsa', 'snowmobile borsa', 'activitati borsa'],
  openGraph: {
    title: 'Servicii Turistice Borșa — ATV, Schi, Drumeții',
    description: 'Servicii turistice în Borșa — ATV, snowmobile, drumeții, schi, călărie, rafting în Munții Rodnei.',
  },
};

export default function ServiciiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
