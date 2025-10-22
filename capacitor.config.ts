import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hanoutprice.app',
  appName: 'Hanout Price',
  webDir: 'out', // Standard pour Next.js, utilisé pour les builds de production
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#FF6F61",
      showSpinner: true,
      spinnerColor: "#FFFFFF",
    },
  },
};

export default config;
