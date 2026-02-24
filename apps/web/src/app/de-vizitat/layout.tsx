import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Obiective Turistice Borșa — Ce Să Vizitezi | VisitBorsa',
  description:
    'Obiective turistice în Borșa, Maramureș — Cascada Cailor, Munții Rodnei, lacuri glaciare, trasee montane. Descoperă ce să vizitezi în Borșa.',
  keywords: ['obiective turistice borsa', 'ce sa vizitezi borsa', 'cascada cailor', 'muntii rodnei', 'trasee montane borsa', 'turism borsa'],
  openGraph: {
    title: 'Obiective Turistice Borșa — Ce Să Vizitezi',
    description: 'Cascada Cailor, Munții Rodnei, lacuri glaciare și trasee montane în Borșa, Maramureș.',
  },
};

export default function DeVizitatLayout({ children }: { children: React.ReactNode }) {
  return children;
}
