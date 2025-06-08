import { useEffect, useState } from 'react';
import styles from './app.module.scss';

// Add BeforeInstallPromptEvent interface
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function App() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    // Register PWA service worker only in production
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        const swPath =
          process.env.NODE_ENV === 'production'
            ? '/chinese-listening-trainer/sw.js'
            : '/sw.js';
        navigator.serviceWorker
          .register(swPath)
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show install button
      setShowInstallButton(true);
    };

    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstallPrompt as EventListener
    );

    // Listen for the app installed event
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt as EventListener
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      // Clear the deferredPrompt so it can only be used once
      setDeferredPrompt(null);
      setShowInstallButton(false);
    }
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Chinese Listening Trainer</h1>
        <p>A Progressive Web App for improving your Chinese listening skills</p>
        {showInstallButton && (
          <button onClick={handleInstallClick} className={styles.installButton}>
            📱 Install App
          </button>
        )}
      </header>

      <main className={styles.main}>
        <div className={styles.hero}>
          <h2>Hello World! 你好世界！</h2>
          <p>Welcome to your Chinese Listening Trainer PWA!</p>
          <div className={styles.features}>
            <div className={styles.feature}>
              <h3>📱 Progressive Web App</h3>
              <p>Install on your Android device for a native app experience</p>
            </div>
            <div className={styles.feature}>
              <h3>🎧 Audio Training</h3>
              <p>Practice listening with authentic Chinese audio content</p>
            </div>
            <div className={styles.feature}>
              <h3>📊 Track Progress</h3>
              <p>Monitor your improvement over time</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
