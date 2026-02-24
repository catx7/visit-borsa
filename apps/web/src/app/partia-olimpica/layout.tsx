import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pârtii Schi Borșa — Olimpică, Cascada Cailor, Prislop | VisitBorsa',
  description:
    'Pârtii de schi în Borșa, Maramureș — Pârtia Olimpică cu telegondolă, Cascada Cailor și Prislop. Informații, prețuri și condiții de schi.',
  keywords: ['partia olimpica borsa', 'schi borsa', 'telegondola borsa', 'partii schi maramures', 'cascada cailor schi', 'prislop schi'],
  openGraph: {
    title: 'Pârtii Schi Borșa — Olimpică, Cascada Cailor, Prislop',
    description: 'Pârtii de schi în Borșa — Olimpică cu telegondolă, Cascada Cailor și Prislop.',
  },
};

export default function PartiaSchiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
