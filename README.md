# Pivot Mobile App

This repository contains the Pivot mobile application built with [Expo](https://expo.dev/).

## Getting Started

1. Install **Node.js 20**.
2. Install dependencies:
   ```bash
   cd mobile
   npm install
   ```
3. Copy `mobile/.env.example` to `mobile/.env` and provide your Supabase credentials.
4. Start the development server:
   ```bash
   npm start --prefix mobile
   ```
   This will launch Expo Dev Tools in your browser. You can run the app on a simulator or on a physical device with the Expo Go app.

## Testing

Run unit tests from the `mobile` directory:

```bash
npm test --prefix mobile
```
