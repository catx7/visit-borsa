'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, X, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'pwa-install-dismissed';
const DISMISS_DAYS = 14;

function isIosSafari() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const isIos = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|OPiOS|EdgiOS/.test(ua);
  return isIos && isSafari;
}

function isStandalone() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches
    || ('standalone' in window.navigator && (window.navigator as unknown as { standalone: boolean }).standalone);
}

function wasDismissedRecently() {
  const dismissed = localStorage.getItem(DISMISSED_KEY);
  if (!dismissed) return false;
  return Date.now() - parseInt(dismissed, 10) < DISMISS_DAYS * 24 * 60 * 60 * 1000;
}

export function InstallPrompt() {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [mode, setMode] = useState<'hidden' | 'native' | 'ios'>('hidden');

  useEffect(() => {
    if (isStandalone() || wasDismissedRecently()) return;

    if (isIosSafari()) {
      setMode('ios');
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setMode('native');
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setMode('hidden');
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setMode('hidden');
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
  };

  if (mode === 'hidden') return null;

  // iOS Safari: fixed bottom banner with manual instructions
  if (mode === 'ios') {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="mx-auto max-w-lg px-4 py-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent mt-0.5">
              <Download className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">{t('pwa.installTitle')}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {t('pwa.iosInstructions')} <Share className="inline h-3.5 w-3.5 -mt-0.5" /> {t('pwa.iosThen')}
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label={t('common.close')}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Chrome/Android: top banner with install button
  return (
    <div className="border-b border-accent/20 bg-accent/5">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Download className="h-4 w-4" />
          </div>
          <p className="text-sm text-foreground truncate">
            <span className="font-medium">{t('pwa.installTitle')}</span>
            <span className="hidden sm:inline text-muted-foreground"> — {t('pwa.installDescription')}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstall}
            className="rounded-lg bg-accent px-3.5 py-1.5 text-xs font-semibold text-accent-foreground transition hover:bg-accent/90"
          >
            {t('pwa.install')}
          </button>
          <button
            onClick={handleDismiss}
            className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label={t('common.close')}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
