# findoors

A React Native / Expo-powered indoor/outdoor campus/office navigation app using Mapbox & custom-built local BLE Beacons.

## Table of Contents

1. [Features](#features)  
2. [Tech Stack](#tech-stack)  
3. [Prerequisites](#prerequisites)  
4. [Getting Started](#getting-started)  

## Features

- 📍 Interactive maps with [`@rnmapbox/maps`](package.json)  
- 🚀 File-based routing with [Expo Router](app/_layout.tsx)  
- 🌐 Localization with Lingui  
- 🎨 Custom UI components in [components](components/)  

## TODO Features

- 🔒 Authentication & real-time data via [`@supabase/supabase-js`](package.json) ([`lib/supabase.ts`](lib/supabase.ts))  

## Tech Stack

- **React Native** & **Expo** ([expo](package.json))  
- **Expo Router** for navigation  
- **Mapbox** for mapping  
- **Supabase** for backend temporarily
- **TypeScript**  
- **ESLint** & **Prettier**  

## Prerequisites

- Node.js ≥14  
- npm or yarn  
- Expo CLI:  

For custom build follow [eas local build guide](https://docs.expo.dev/build-reference/local-builds/) or use eas-cli.

  ```bash
  npm install -g expo-cli eas-cli
  ```

## Getting Started

1. Clone the repo

   ```bash
   git clone https://github.com/your-org/findoors.git
   cd findoors/app
   ```

2. Install dependencies

   ```bash
   yarn install
   # or
   npm install
   ```

3. Copy & configure your environment

   ```bash
   cp .env.example .env
   # Make sure to edit the .env file to include your URL and ANON_KEY
   ```

4. Run the app

   ```bash
   yarn expo start
   # or
   npx expo start
   ```
