import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { i18n } from '@lingui/core';
import { I18nProvider } from "@lingui/react";
import { BlurView } from 'expo-blur';
import { router, Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, Pressable, useColorScheme } from 'react-native';


export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <I18nProvider i18n={i18n}>
    <StatusBar style={isDark ? 'light' : 'dark'} />
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.8)',
            borderTopWidth: 0,
            shadowColor: 'transparent'
          },
          default: {
            backgroundColor: isDark ? '#121212' : '#ffffff',
            borderTopWidth: 0,
            elevation: 0,
            shadowColor: 'transparent',
          },
        }),
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView
              intensity={20}
              tint={isDark ? 'dark' : 'light'}
              style={{ flex: 1 }}
            />
          ) : null
      }}>
      <Tabs.Screen
        name="feed"
        options={{
          title: "Feed",
          headerShown: true
        }}
      />
      <Tabs.Screen
        name="neighbors"
        options={{
          title: `Neighbors`,
          headerShown: true,
          headerStyle: { backgroundColor: isDark ? '#121212' : '#ffffff' },
          headerTitleStyle: { color: isDark ? 'white' : 'black' },
          headerRight: () => (
            <Pressable
              onPress={() => {router.push('/friends/add');}}
            >
              <MaterialCommunityIcons
                name="account-multiple-plus"
                size={24}
                color={isDark ? 'white' : 'black'}
                style={{ marginRight: 10 }}
              />
            </Pressable>
          ),
          tabBarIcon: ({ color }) => ( 
            <MaterialCommunityIcons name="home-group" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: `Happenings`,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="event" size={24} color={color} /> 
          ),
        }} 
      />  
      <Tabs.Screen
        name="index"
        options={{
          title: `Map`,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="map" size={24} color={color} />
          ),
        }}
      />  
      <Tabs.Screen
        name="passport"
        options={{
          title: `Passport`,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="passport" size={24} color={color} />
          ),
        }}
      />  
    </Tabs>
    </I18nProvider>
  );
}
