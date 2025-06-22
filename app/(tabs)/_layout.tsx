import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { i18n } from '@lingui/core';
import { I18nProvider } from "@lingui/react";
import { router, Tabs } from 'expo-router';
import React from 'react';
import { Platform, Pressable } from 'react-native';

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
          headerRight: () => (
            <Pressable
              onPress={() => {router.push('/friends/add');}}
            >
              <MaterialCommunityIcons
                name="account-multiple-plus"
                size={24}
                color="black"
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
