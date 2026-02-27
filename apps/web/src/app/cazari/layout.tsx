import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cazări Borșa — Pensiuni, Hoteluri, Vile, Cabane | VisitBorșa',
  description:
    'Găsește cazare în Borșa, Maramureș — pensiuni, hoteluri, vile, cabane, apartamente. Rezervă cazare la cele mai bune prețuri în inima Munților Rodnei.',
  keywords: ['cazare borsa', 'pensiuni borsa', 'hoteluri borsa', 'vile borsa', 'cabane borsa', 'cazare maramures', 'cazare muntii rodnei'],
  openGraph: {
    title: 'Cazări Borșa — Pensiuni, Hoteluri, Vile',
    description: 'Găsește cazare în Borșa, Maramureș — pensiuni, hoteluri, vile, cabane la cele mai bune prețuri.',
  },
};

export default function CazariLayout({ children }: { children: React.ReactNode }) {
  return children;
}
