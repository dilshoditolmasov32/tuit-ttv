import React, { useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

const EMAILJS_SERVICE_ID: string = 'service_cwexuec';
const EMAILJS_TEMPLATE_ID: string = 'template_xac9wz6';
const EMAILJS_PUBLIC_KEY: string = '-DLNBmKXWARWrmDNv';

const EMAILJS_PLACEHOLDERS = {
  serviceId: 'YOUR_SERVICE_ID',
  templateId: 'YOUR_TEMPLATE_ID',
  publicKey: 'YOUR_PUBLIC_KEY',
} as const;

type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>;

const CONTACT_UI = {
  placeholders: {
    name: {
      uz: 'John Doe',
      ru: 'Иван Иванов',
      en: 'John Doe',
    },
    email: {
      uz: 'john@example.com',
      ru: 'ivan@example.com',
      en: 'john@example.com',
    },
    message: {
      uz: 'Qanday yordam bera olamiz?',
      ru: 'Чем мы можем помочь?',
      en: 'How can we help?',
    },
  },
  locationInfo: {
    uz: 'Manzil',
    ru: 'Локация',
    en: 'Location Info',
  },
  sending: {
    uz: 'Yuborilmoqda...',
    ru: 'Отправка...',
    en: 'Sending...',
  },
  success: {
    uz: 'Xabaringiz muvaffaqiyatli yuborildi.',
    ru: 'Ваше сообщение успешно отправлено.',
    en: 'Your message was sent successfully.',
  },
  error: {
    uz: 'Xabarni yuborishda xatolik yuz berdi. Qayta urinib ko‘ring.',
    ru: 'Не удалось отправить сообщение. Попробуйте снова.',
    en: 'Failed to send your message. Please try again.',
  },
  configError: {
    uz: 'EmailJS sozlamalarini SERVICE_ID, TEMPLATE_ID va PUBLIC_KEY bilan yangilang.',
    ru: 'Обновите настройки EmailJS: SERVICE_ID, TEMPLATE_ID и PUBLIC_KEY.',
    en: 'Update the EmailJS settings with your SERVICE_ID, TEMPLATE_ID, and PUBLIC_KEY.',
  },
  validation: {
    nameRequired: {
      uz: 'Ism kiritilishi shart.',
      ru: 'Имя обязательно.',
      en: 'Name is required.',
    },
    emailRequired: {
      uz: 'Email kiritilishi shart.',
      ru: 'Email обязателен.',
      en: 'Email is required.',
    },
    emailInvalid: {
      uz: 'Email formati noto‘g‘ri.',
      ru: 'Неверный формат email.',
      en: 'Enter a valid email address.',
    },
    messageRequired: {
      uz: 'Xabar matni kiritilishi shart.',
      ru: 'Сообщение обязательно.',
      en: 'Message is required.',
    },
  },
};

const INITIAL_FORM_STATE: ContactFormData = {
  name: '',
  email: '',
  message: '',
};

const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

declare global {
  interface Window {
    ymaps?: any;
  }
}

const MAP_ADDRESS = 'Toshkent sh., Amir Temur ko‘chasi, 108';
const MAP_FALLBACK_CENTER: [number, number] = [41.33852, 69.28557];

const CONTACT_MAP_UI = {
  mapTitle: {
    uz: 'Yandex xarita',
    ru: 'Яндекс карта',
    en: 'Yandex Map',
  },
  loading: {
    uz: 'Xarita yuklanmoqda...',
    ru: 'Карта загружается...',
    en: 'Loading map...',
  },
  error: {
    uz: 'Xaritani yuklab bo‘lmadi.',
    ru: 'Не удалось загрузить карту.',
    en: 'Failed to load the map.',
  },
};

const Contact: React.FC<{ lang: Language }> = ({ lang }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [mapState, setMapState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const initMap = () => {
      if (cancelled || !mapContainerRef.current) {
        return;
      }

      if (!window.ymaps) {
        attempts += 1;

        if (attempts > 30) {
          setMapState('error');
          return;
        }

        retryTimer = setTimeout(initMap, 300);
        return;
      }

      window.ymaps.ready(async () => {
        if (cancelled || !mapContainerRef.current || mapInstanceRef.current) {
          return;
        }

        try {
          const map = new window.ymaps.Map(mapContainerRef.current, {
            center: MAP_FALLBACK_CENTER,
            zoom: 16,
            controls: ['zoomControl', 'fullscreenControl'],
          });

          map.behaviors.disable('scrollZoom');

          const placemark = new window.ymaps.Placemark(
            MAP_FALLBACK_CENTER,
            {
              balloonContentHeader: 'TATU',
              balloonContentBody: TRANSLATIONS[lang].address,
              hintContent: MAP_ADDRESS,
            },
            {
              preset: 'islands#cyanIcon',
            }
          );

          map.geoObjects.add(placemark);

          try {
            const result = await window.ymaps.geocode(MAP_ADDRESS, { results: 1 });
            const firstGeoObject = result.geoObjects.get(0);

            if (firstGeoObject) {
              const coords = firstGeoObject.geometry.getCoordinates();
              placemark.geometry.setCoordinates(coords);
              map.setCenter(coords, 17, { duration: 300 });
            }
          } catch {
            // Fallback center is already applied above.
          }

          mapInstanceRef.current = map;
          setMapState('ready');
        } catch {
          setMapState('error');
        }
      });
    };

    initMap();

    return () => {
      cancelled = true;

      if (retryTimer) {
        clearTimeout(retryTimer);
      }

      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, [lang]);

  const validateForm = (): ContactFormErrors => {
    const nextErrors: ContactFormErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = CONTACT_UI.validation.nameRequired[lang];
    }

    if (!formData.email.trim()) {
      nextErrors.email = CONTACT_UI.validation.emailRequired[lang];
    } else if (!isEmailValid(formData.email.trim())) {
      nextErrors.email = CONTACT_UI.validation.emailInvalid[lang];
    }

    if (!formData.message.trim()) {
      nextErrors.message = CONTACT_UI.validation.messageRequired[lang];
    }

    return nextErrors;
  };

  const handleChange =
    (field: keyof ContactFormData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;

      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }

      if (status) {
        setStatus(null);
      }
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus(null);
      return;
    }

    if (
      EMAILJS_SERVICE_ID === EMAILJS_PLACEHOLDERS.serviceId ||
      EMAILJS_TEMPLATE_ID === EMAILJS_PLACEHOLDERS.templateId ||
      EMAILJS_PUBLIC_KEY === EMAILJS_PLACEHOLDERS.publicKey
    ) {
      setStatus({
        type: 'error',
        message: CONTACT_UI.configError[lang],
      });
      return;
    }

    setIsSending(true);
    setStatus(null);

    try {
      // EmailJS template variables should match your configured template fields.
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name.trim(),
          from_email: formData.email.trim(),
          message: formData.message.trim(),
          reply_to: formData.email.trim(),
        },
        EMAILJS_PUBLIC_KEY
      );

      setStatus({
        type: 'success',
        message: CONTACT_UI.success[lang],
      });
      setFormData(INITIAL_FORM_STATE);
      setErrors({});
    } catch {
      setStatus({
        type: 'error',
        message: CONTACT_UI.error[lang],
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="pt-24 pb-20 md:pt-32 md:pb-32">
      <section className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 md:mb-24">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-[7rem] font-black mb-6 md:mb-8 uppercase tracking-tighter"
          >
            {TRANSLATIONS[lang].contactTitle}
          </motion.h1>
          <p className="text-gray-500 text-sm sm:text-base md:text-lg max-w-2xl mx-auto uppercase tracking-[0.2em] md:tracking-widest">
            {TRANSLATIONS[lang].contactSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 xl:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="h-[380px] sm:h-[460px] lg:h-[600px] glass rounded-[2rem] md:rounded-[4rem] relative overflow-hidden"
          >
            <div className="absolute top-6 left-6 md:top-10 md:left-10 z-10">
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.35em] md:tracking-[0.5em] text-cyan-500">
                {CONTACT_MAP_UI.mapTitle[lang]}
              </span>
            </div>
            <div
              ref={mapContainerRef}
              className="absolute inset-0"
              aria-label={CONTACT_MAP_UI.mapTitle[lang]}
            />

            {mapState !== 'ready' && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#050505]/80 backdrop-blur-sm z-[1]">
                <div className="glass rounded-3xl px-6 py-5 border border-white/10 text-center max-w-xs">
                  <p className="text-sm font-semibold text-white">
                    {mapState === 'loading' ? CONTACT_MAP_UI.loading[lang] : CONTACT_MAP_UI.error[lang]}
                  </p>
                </div>
              </div>
            )}

            <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-auto z-10 max-w-xs rounded-3xl border border-white/15 bg-black/65 p-5 shadow-2xl backdrop-blur-xl md:p-8 pointer-events-none">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-cyan-400/10 opacity-70" />
              <p className="relative text-[10px] md:text-xs text-gray-300 uppercase tracking-widest mb-2">
                {CONTACT_UI.locationInfo[lang]}
              </p>
              <p className="relative text-sm font-bold text-white leading-relaxed">
                {TRANSLATIONS[lang].address}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 rounded-[2rem] md:rounded-[4rem] border border-white/5"
          >
            <form className="space-y-6 md:space-y-8 lg:space-y-10" onSubmit={handleSubmit} noValidate>
              <div>
                <label
                  htmlFor="contact-name"
                  className="text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-gray-500 mb-3 md:mb-4 block"
                >
                  {TRANSLATIONS[lang].nameLabel}
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange('name')}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'contact-name-error' : undefined}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 md:px-8 md:py-6 outline-none focus:border-cyan-500 transition-all text-white text-sm sm:text-base placeholder:text-gray-500"
                  placeholder={CONTACT_UI.placeholders.name[lang]}
                />
                {errors.name && (
                  <p id="contact-name-error" className="mt-3 text-sm text-red-400">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-gray-500 mb-3 md:mb-4 block"
                >
                  {TRANSLATIONS[lang].emailLabel}
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'contact-email-error' : undefined}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 md:px-8 md:py-6 outline-none focus:border-cyan-500 transition-all text-white text-sm sm:text-base placeholder:text-gray-500"
                  placeholder={CONTACT_UI.placeholders.email[lang]}
                />
                {errors.email && (
                  <p id="contact-email-error" className="mt-3 text-sm text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-gray-500 mb-3 md:mb-4 block"
                >
                  {TRANSLATIONS[lang].messageLabel}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange('message')}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 md:px-8 md:py-6 outline-none focus:border-cyan-500 transition-all text-white text-sm sm:text-base resize-none placeholder:text-gray-500"
                  placeholder={CONTACT_UI.placeholders.message[lang]}
                />
                {errors.message && (
                  <p id="contact-message-error" className="mt-3 text-sm text-red-400">
                    {errors.message}
                  </p>
                )}
              </div>

              {status && (
                <div
                  className={`rounded-2xl border px-5 py-4 text-sm sm:text-base ${
                    status.type === 'success'
                      ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300'
                      : 'border-red-400/30 bg-red-500/10 text-red-300'
                  }`}
                  role="status"
                >
                  {status.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-4 md:py-6 bg-white text-black font-black uppercase tracking-[0.2em] md:tracking-widest rounded-2xl hover:bg-cyan-500 hover:text-white transition-all transform active:scale-95 shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-white disabled:hover:text-black"
              >
                {isSending ? CONTACT_UI.sending[lang] : TRANSLATIONS[lang].submit}
              </button>
            </form>

            <div className="mt-10 md:mt-16 pt-10 md:pt-16 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-8 text-sm">
              <div className="flex items-center gap-4 text-gray-400">
                <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-cyan-500 shrink-0">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <span className="break-all">+998 93 571 14 42</span>
              </div>
              <div className="flex items-center gap-4 text-gray-400">
                <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-cyan-500 shrink-0">
                  <i className="fas fa-envelope"></i>
                </div>
                <span className="break-all">info@tv-tech.uz</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
