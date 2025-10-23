'use client';

import { useEffect } from 'react';
import i18next, { type KeyPrefix } from 'i18next';
import {
  initReactI18next,
  useTranslation as useTranslationOrg,
  type UseTranslationOptions,
  type FallbackNs,
} from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { getOptions } from './settings';

//
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)))
  .init({
    ...getOptions(),
    lng: undefined, // let browser language detector handle it
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
    },
  });

export { i18next as i18n };

export function useTranslation<
  Ns extends FallbackNs<"translation">,
  KPrefix extends KeyPrefix<Ns> = undefined
>(
  ns?: Ns,
  options?: UseTranslationOptions<KPrefix>,
) {
  const ret = useTranslationOrg(ns, options);
  const { i18n } = ret;
  useEffect(() => {
    if (i18n.resolvedLanguage === 'ar') document.dir = 'rtl';
    else document.dir = 'ltr';
  }, [i18n.resolvedLanguage]);
  return ret;
}