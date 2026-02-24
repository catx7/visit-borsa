import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Restaurante Borșa — Unde să Mănânci în Borșa | VisitBorsa',
  description:
    'Restaurante în Borșa, Maramureș — bucătărie tradițională, internațională și locală. Descoperă cele mai bune locuri unde să mănânci în Borșa.',
  keywords: ['restaurante borsa', 'unde sa mananci borsa', 'mancare borsa', 'restaurante maramures', 'bucatarie traditionala borsa'],
  openGraph: {
    title: 'Restaurante Borșa — Unde să Mănânci',
    description: 'Restaurante în Borșa, Maramureș — bucătărie tradițională și internațională.',
  },
};

export default function RestauranteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
