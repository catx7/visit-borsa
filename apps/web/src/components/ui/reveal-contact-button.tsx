'use client';

import { useState } from 'react';
import { Phone, Mail, Globe, Eye, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import * as api from '@/lib/api';

type ContactType = 'PHONE' | 'EMAIL' | 'WEBSITE' | 'WHATSAPP';
type EntityType = 'PROPERTY' | 'SERVICE' | 'RESTAURANT';

interface RevealContactButtonProps {
  value: string;
  contactType: ContactType;
  entityType: EntityType;
  entityId: string;
}

function maskValue(value: string, contactType: ContactType): string {
  if (contactType === 'PHONE') {
    if (value.length <= 4) return '***';
    return value.slice(0, 4) + '***' + value.slice(-2);
  }
  if (contactType === 'EMAIL') {
    const [local, domain] = value.split('@');
    if (!domain) return '***';
    return local.slice(0, 2) + '***@' + domain;
  }
  return '***';
}

const iconMap: Record<ContactType, typeof Phone> = {
  PHONE: Phone,
  EMAIL: Mail,
  WEBSITE: Globe,
  WHATSAPP: MessageCircle,
};

const hrefMap: Record<ContactType, (v: string) => string> = {
  PHONE: (v) => `tel:${v}`,
  EMAIL: (v) => `mailto:${v}`,
  WEBSITE: (v) => v,
  WHATSAPP: (v) => `https://wa.me/${v.replace(/[^\d]/g, '')}`,
};

export function RevealContactButton({ value, contactType, entityType, entityId }: RevealContactButtonProps) {
  const [revealed, setRevealed] = useState(false);
  const { t } = useTranslation();
  const Icon = iconMap[contactType];

  const handleReveal = () => {
    setRevealed(true);
    api.trackContactClick({ entityType, entityId, contactType }).catch(() => {});
  };

  if (revealed) {
    return (
      <a
        href={hrefMap[contactType](value)}
        {...(contactType === 'WEBSITE' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <Icon className="h-4 w-4" />
        {contactType === 'WEBSITE' ? t('services.website') : value}
      </a>
    );
  }

  return (
    <button
      onClick={handleReveal}
      className="flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer"
    >
      <Icon className="h-4 w-4" />
      <span>{maskValue(value, contactType)}</span>
      <Eye className="h-3.5 w-3.5 text-primary" />
    </button>
  );
}
