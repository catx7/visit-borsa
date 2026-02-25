'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as api from '@/lib/api';

interface WhatsAppBookingButtonProps {
  phone: string;
  propertyName: string;
  entityId: string;
  maxGuests: number;
}

function normalizePhoneForWhatsApp(phone: string): string {
  let cleaned = phone.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('0') && !cleaned.startsWith('00')) {
    cleaned = '40' + cleaned.slice(1);
  }
  cleaned = cleaned.replace(/^\+/, '');
  return cleaned;
}

export function WhatsAppBookingButton({
  phone,
  propertyName,
  entityId,
  maxGuests,
}: WhatsAppBookingButtonProps) {
  const { t } = useTranslation();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [persons, setPersons] = useState(2);

  const today = new Date().toISOString().split('T')[0];
  const canSend = checkIn && checkOut && persons > 0;

  const handleSend = () => {
    if (!canSend) return;

    const normalizedPhone = normalizePhoneForWhatsApp(phone);
    const message = t('whatsapp.messageTemplate', {
      propertyName,
      checkIn,
      checkOut,
      persons: String(persons),
    });

    const url = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;

    api
      .trackContactClick({
        entityType: 'PROPERTY',
        entityId,
        contactType: 'WHATSAPP',
      })
      .catch(() => {});

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          {t('whatsapp.checkIn')}
        </label>
        <Input
          type="date"
          value={checkIn}
          min={today}
          onChange={(e) => {
            setCheckIn(e.target.value);
            if (checkOut && e.target.value > checkOut) setCheckOut('');
          }}
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          {t('whatsapp.checkOut')}
        </label>
        <Input
          type="date"
          value={checkOut}
          min={checkIn || today}
          onChange={(e) => setCheckOut(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          {t('whatsapp.persons')}
        </label>
        <Input
          type="number"
          min={1}
          max={maxGuests}
          value={persons}
          onChange={(e) => setPersons(Number(e.target.value))}
        />
      </div>
      <Button
        onClick={handleSend}
        disabled={!canSend}
        className="w-full gap-2 bg-[#25D366] text-white hover:bg-[#1da851]"
      >
        <MessageCircle className="h-4 w-4" />
        {t('whatsapp.sendMessage')}
      </Button>
    </div>
  );
}
