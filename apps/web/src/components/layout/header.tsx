'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import {
  Menu,
  X,
  Globe,
  LogOut,
  User,
  LayoutDashboard,
  Shield,
  Bed,
  Wrench,
  UtensilsCrossed,
  Compass,
  Info,
  Mountain,
} from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ro' ? 'en' : 'ro';
    i18n.changeLanguage(newLang);
  };

  const navLinks = [
    { href: '/cazari', label: t('nav.cazari'), icon: Bed },
    { href: '/servicii', label: t('nav.servicii'), icon: Wrench },
    { href: '/restaurante', label: t('nav.restaurante'), icon: UtensilsCrossed },
    { href: '/de-vizitat', label: t('nav.deVizitat'), icon: Compass },
    { href: '/despre-borsa', label: t('nav.despreBorsa'), icon: Info },
    { href: '/partia-olimpica', label: t('nav.partiaOlimpica'), icon: Mountain },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/images/logo.png" alt={t('site.name')} width={36} height={36} className="rounded-xl shadow-sm" />
          <span className="hidden font-bold text-lg tracking-tight sm:inline-block">
            {t('site.name')}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            title="Switch language"
            className="gap-1.5 rounded-lg"
          >
            <Globe className="h-4 w-4" />
            <span className="text-xs font-semibold">{i18n.language.toUpperCase()}</span>
          </Button>

          {user ? (
            <>
              {user.role === 'ADMIN' && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="gap-1.5 rounded-lg">
                    <Shield className="h-4 w-4" />
                    {t('nav.admin')}
                  </Button>
                </Link>
              )}
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-1.5 rounded-lg">
                  <LayoutDashboard className="h-4 w-4" />
                  {t('nav.dashboard')}
                </Button>
              </Link>
              <Link href="/dashboard/profil">
                <Button variant="ghost" size="sm" className="gap-1.5 rounded-lg">
                  <User className="h-4 w-4" />
                  {user.firstName ?? user.email}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout} className="gap-1.5 rounded-lg">
                <LogOut className="h-4 w-4" />
                {t('nav.logout')}
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="rounded-lg">{t('nav.login')}</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="rounded-lg bg-accent text-accent-foreground hover:bg-accent/90">{t('nav.register')}</Button>
              </Link>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="space-y-1 px-4 py-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
            <hr className="my-2 border-border" />
            <button
              onClick={() => { toggleLanguage(); setMobileMenuOpen(false); }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted"
            >
              <Globe className="h-4 w-4" />
              {i18n.language === 'ro' ? 'English' : 'Română'}
            </button>
            {user ? (
              <>
                {user.role === 'ADMIN' && (
                  <Link href="/admin" className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                    <Shield className="h-4 w-4" />
                    {t('nav.admin')}
                  </Link>
                )}
                <Link href="/dashboard" className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                  <LayoutDashboard className="h-4 w-4" />
                  {t('nav.dashboard')}
                </Link>
                <Link href="/dashboard/profil" className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                  <User className="h-4 w-4" />
                  {t('nav.profile')}
                </Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted">
                  <LogOut className="h-4 w-4" />
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                  {t('nav.login')}
                </Link>
                <Link href="/register" className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-accent hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
