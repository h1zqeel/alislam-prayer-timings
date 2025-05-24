# PrayerTime Next.js App

A small Next.js client-side app for displaying daily prayer times and letting users configure their location & timezone. Supports light/dark mode, RTL (Urdu), and stores preferences locally.

## Screens

### 1. Prayer Times Home
The main dashboard where users see today’s prayer schedule.

- **Current Date & Location**
  - Shows the formatted date and the user’s chosen city/address
  - Auto-updates when settings change

- **Prayer Time List**
  - Fajr, Dhuhr, Asr, Maghrib, Isha
  - Times calculated by `usePrayer` context using stored coords & timezone

- **Dark/Light & RTL Support**
  - Inherits site theme
  - Switches layout direction for Urdu locale

### 2. Settings
Configure address, coordinates & timezone.

- **Address Lookup**
  - Enter an address and click the map-marker icon to geocode via OpenStreetMap  
  - Populates latitude & longitude fields

- **Manual Coordinates**
  - Edit latitude and longitude directly if desired

- **Timezone Picker**
  - Full IANA list, with detected system timezone pinned to the top
  - RTL-aware styling for Urdu

- **Save & Validation**
  - “Save” button disabled until both latitude and longitude are valid numbers  
  - Persists in localStorage via `useStorage`  
  - Pushes new settings into `usePrayer` and navigates back

## Tech Stack

- **Next.js 15** with `app/` router 
- **React** hooks & Context (`usePrayer`)  
- **next-intl** for translations & locale detection  
- **Tailwind CSS** (including dark mode & custom fonts)  
- **Font Awesome** for icons
- **LocalStorage** via a custom `useStorage` hook  
- **OpenStreetMap/Nominatim** for geocoding  

## Getting Started

```bash
clone the repo
cd alislam-prayer-timings

npm install

npm run dev
```

## For Production Bild

```bash
npm run build

npm run start
```

