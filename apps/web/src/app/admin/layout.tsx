'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/auth-context';
import {
  BarChart3,
  Building2,
  Wrench,
  UtensilsCrossed,
  MapPin,
  Star,
  Users,
  Shield,
} from 'lucide-react';

const navItems = [
  { href: '/admin', icon: BarChart3, labelKey: 'admin.nav.dashboard' },
  { href: '/admin/cazari', icon: Building2, labelKey: 'admin.nav.cazari' },
  { href: '/admin/servicii', icon: Wrench, labelKey: 'admin.nav.servicii' },
  { href: '/admin/restaurante', icon: UtensilsCrossed, labelKey: 'admin.nav.restaurante' },
  { href: '/admin/de-vizitat', icon: MapPin, labelKey: 'admin.nav.deVizitat' },
  { href: '/admin/promovate', icon: Star, labelKey: 'admin.nav.promovate' },
  { href: '/admin/utilizatori', icon: Users, labelKey: 'admin.nav.utilizatori' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (user.role !== 'ADMIN') {
      router.replace('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl gap-0 px-4 sm:px-6 lg:px-8">
      {/* Sidebar — desktop */}
      <aside className="hidden w-64 shrink-0 border-r border-border py-8 pr-6 md:block">
        <div className="mb-8 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">{t('admin.title')}</h2>
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background md:hidden">
        <nav className="flex justify-around py-2">
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-2 py-1 text-xs ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="truncate">{t(item.labelKey)}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <main className="flex-1 py-8 pb-20 md:pb-8 md:pl-6">
        {children}
      </main>
    </div>
  );
}
