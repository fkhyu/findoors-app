import en from '@/locales/en/messages.po';
import fi from '@/locales/fi/messages.po';
import sv from '@/locales/sv/messages.po';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { getLocales } from 'expo-localization';
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

const locales = getLocales();
const language = locales[0].languageCode;

i18n.load({ en, fi, sv })

if (language === "fi" || language === "sv" || language === "en") {
  i18n.activate(language);
  console.log(`Activated language: ${language}`);
} else {
  i18n.activate("en");
  console.log(`Defaulting to English, activated language: en`);
}

export default function RootLayout() {
  return (
    <I18nProvider i18n={i18n}>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle={'dark-content'}/>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </GestureHandlerRootView>
    </I18nProvider>
  );
}
