import { MaterialIcons } from '@expo/vector-icons';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { I18nProvider } from "@lingui/react";
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <I18nProvider i18n={i18n}>
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="find"
        options={{
          title: t`Find`,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="search" size={24} color={color} />
          ),
        }}
      />    
      <Tabs.Screen
        name="debug"
        options={{
          headerShown: false,
          title: t`Debug`,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="bug-report" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: t`Map`,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="map" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="buildings"
        options={{
          title: t`Buildings`,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="business" size={24} color={color} />
          ),
        }}
      />      
    </Tabs>
    </I18nProvider>
  );
}
