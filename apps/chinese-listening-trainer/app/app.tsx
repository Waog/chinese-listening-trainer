import { useEffect, useState } from 'react';
import styles from './app.module.scss';

// Standard BeforeInstallPromptEvent interface
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function App() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    // Standard beforeinstallprompt event listener
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Store the event for potential manual triggering later
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstallPrompt as EventListener
    );

    // Standard app installed event listener
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
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);
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
            <span role="img" aria-label="mobile phone">
              📱
            </span>{' '}
            Install App
          </button>
        )}
      </header>

      <main className={styles.main}>
        <div className={styles.hero}>
          <h2>Hello World! 你好世界！</h2>
          <p>Welcome to your Chinese Listening Trainer PWA!</p>
          <div className={styles.features}>
            <div className={styles.feature}>
              <h3>
                <span role="img" aria-label="mobile phone">
                  📱
                </span>{' '}
                Progressive Web App
              </h3>
              <p>Install on your Android device for a native app experience</p>
            </div>
            <div className={styles.feature}>
              <h3>
                <span role="img" aria-label="headphones">
                  🎧
                </span>{' '}
                Audio Training
              </h3>
              <p>Practice listening with authentic Chinese audio content</p>
            </div>
            <div className={styles.feature}>
              <h3>
                <span role="img" aria-label="chart">
                  📊
                </span>{' '}
                Track Progress
              </h3>
              <p>Monitor your improvement over time</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
