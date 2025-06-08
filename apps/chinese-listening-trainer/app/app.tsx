import { useEffect } from 'react';
import styles from './app.module.scss';

export function App() {
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
  }, []);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Chinese Listening Trainer</h1>
        <p>A Progressive Web App for improving your Chinese listening skills</p>
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
