// React Native import
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';

// I18n import
import I18n from 'i18n-js';

// Languages import
import en from './en';
import fr from './fr';

const locales = RNLocalize.getLocales();

I18n.defaultLocale = 'en-US';
I18n.fallbacks = false;
I18n.translations = {
  default: en,
  'en-US': en,
  'fr-FR': fr,
  en,
  fr,
};

setLocale();

async function setLocale() {
  const lang = await AsyncStorage.getItem('lang');

  if (lang) {
    I18n.locale = lang;
  } else {
    let currentLang = 'en-US';
    if (Array.isArray(locales)) {
      if (locales[0].languageCode === 'en') {
        currentLang = 'en-US';
      } else if (locales[0].languageCode === 'fr') {
        currentLang = 'fr-FR';
      }
    }

    I18n.locale = currentLang;
    AsyncStorage.setItem('lang', currentLang);
  }
}

export default I18n;
