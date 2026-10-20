import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useI18n, ENGLISH_DEFAULTS, ARABIC_DEFAULTS, hasArabic } from '../i18n';

interface FloatingWhatsAppProps {
  phoneNumber: string;
  defaultMessage: string;
}

export const FloatingWhatsAppButton: React.FC<FloatingWhatsAppProps> = ({
  phoneNumber,
  defaultMessage,
}) => {
  const { lang } = useI18n();
  const isAr = lang === 'ar';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const rawPhone = (phoneNumber || '+970595845086').trim();
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '') || '970595845086';

  const localizedMessage = isAr
    ? hasArabic(defaultMessage)
      ? defaultMessage
      : ARABIC_DEFAULTS.whatsappMessage
    : hasArabic(defaultMessage)
    ? ENGLISH_DEFAULTS.whatsappMessage
    : defaultMessage || ENGLISH_DEFAULTS.whatsappMessage;

  const encodedMsg = encodeURIComponent(localizedMessage);
  const whatsappHref = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={isAr ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}
      title={isAr ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}
      className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 w-13 h-13 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-400 hover:scale-105 text-slate-950 whatsapp-glow shadow-xl transition-all duration-300 ${
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-slate-950/15" />
    </a>
  );
};
