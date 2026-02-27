'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'pwa-install-dismissed';
const DISMISS_DAYS = 14;

export function InstallPrompt() {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // Don't show if user dismissed recently
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      if (Date.now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000) return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
  };

  if (!visible) return null;

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
