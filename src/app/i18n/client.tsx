'use client';

import { I18nextProvider, useTranslation as useTranslationOrg, UseTranslationOptions } from 'react-i18next';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resources from './locales';
import { ReactNode, useEffect } from 'react';

i18next
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'fr',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
  });

export function useTranslation(ns?: string | string[], options?: UseTranslationOptions<unknown> | undefined) {
    const ret = useTranslationOrg(ns, options);
    
    useEffect(() => {
        if (typeof document !== 'undefined') {
            const dir = i18next.dir(i18next.language);
            document.documentElement.dir = dir;
            document.documentElement.lang = i18next.language;
        }
    }, [ret.i18n.language]);

    return ret;
}

export function I18nProvider({ children }: { children: ReactNode }) {
    return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
}

export default i18next;
