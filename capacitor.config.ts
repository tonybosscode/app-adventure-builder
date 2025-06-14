
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.1c858d5084d34d49bbc8c0c89b703858',
  appName: 'A Lovable project',
  webDir: 'dist',
  server: {
    url: 'https://1c858d50-84d3-4d49-bbc8-c0c89b703858.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#6366f1',
      showSpinner: false
    }
  }
};

export default config;
