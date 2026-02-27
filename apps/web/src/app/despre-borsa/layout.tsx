import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Despre Borșa — Istorie, Natură, Tradiții | VisitBorșa',
  description:
    'Descoperă Borșa, Maramureș — istorie, geografie, natură, tradiții și cultură. Oraș la poalele Munților Rodnei, la ~700m altitudine.',
  keywords: ['despre borsa', 'borsa maramures', 'istorie borsa', 'traditii maramures', 'natura borsa', 'muntii rodnei'],
  openGraph: {
    title: 'Despre Borșa — Istorie, Natură, Tradiții',
    description: 'Descoperă Borșa, Maramureș — istorie, geografie, natură și tradiții autentice.',
  },
};

export default function DespreBorsaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
