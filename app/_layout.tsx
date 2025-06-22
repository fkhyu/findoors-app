import { AchievementsProvider } from '@/lib/AchievementContext';
import en from '@/locales/en/messages.po';
import fi from '@/locales/fi/messages.po';
import sv from '@/locales/sv/messages.po';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { getLocales } from 'expo-localization';
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

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
  /*
  useEffect(() => {
    (async () => {
      // Location: foreground & background
      const { status: fg } = await Location.requestForegroundPermissionsAsync();
      const { status: bg } = await Location.requestBackgroundPermissionsAsync();
      if (fg !== 'granted' || bg !== 'granted') {
        console.warn('Location permissions not fully granted');
      }

      // Notifications
      const { status: notif } = await Notifications.requestPermissionsAsync();
      if (notif.status !== 'granted') {
        console.warn('Notifications permission not granted');
      }
    })();
  }, []);
  */

  return (
    <I18nProvider i18n={i18n}>  
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>{/* Wrap with BottomSheetModalProvider */}
        <AchievementsProvider>
          <StatusBar barStyle={'dark-content'}/>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false, title: "App" }} />
            <Stack.Screen name="welcome" options={{ headerShown: false }} />
            <Stack.Screen name="welcome/index" options={{ headerShown: false }} />
            <Stack.Screen name="welcome/whoareyou" options={{ headerShown: false }} />
            <Stack.Screen name="welcome/where" options={{ headerShown: false }} />
            <Stack.Screen name="welcome/when" options={{ headerShown: false }} />
            <Stack.Screen name="welcome/fellows" options={{ headerShown: false }} />
            <Stack.Screen name="welcome/permissions" options={{ headerShown: false }} />
            <Stack.Screen name="welcome/intro" options={{ headerShown: false }} />
            <Stack.Screen name="friends/add" options={{ headerShown: true, title: "Add Neighbors" }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <Toast />
        </AchievementsProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </I18nProvider>
  );
} 