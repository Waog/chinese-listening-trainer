import { useEffect, useState } from 'react';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  type LinksFunction,
  type MetaFunction,
} from 'react-router';

import '../styles.scss';

export const meta: MetaFunction = () => [
  {
    title: 'Chinese Listening Trainer',
  },
  {
    name: 'description',
    content: 'A Progressive Web App for Chinese listening training',
  },
  {
    name: 'theme-color',
    content: '#667eea',
  },
];

export const links: LinksFunction = () => {
  const basePath =
    process.env.NODE_ENV === 'production' ? '/chinese-listening-trainer' : '';

  return [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
    },
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: `${basePath}/favicon.ico`,
    },
    {
      rel: 'apple-touch-icon',
      href: `${basePath}/apple-touch-icon.png`,
    },
    {
      rel: 'manifest',
      href: `${basePath}/manifest.webmanifest`,
    },
  ];
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <PWAInstaller />
      <Outlet />
    </>
  );
}

function PWAInstaller() {
  // Standard BeforeInstallPromptEvent interface
  interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  }

  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    // Standard beforeinstallprompt event listener
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
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

  if (!showInstallButton) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 9999,
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        padding: '0.75rem 1rem',
        color: 'white',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      }}
    >
      <button
        onClick={handleInstallClick}
        style={{
          background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
          border: 'none',
          borderRadius: '8px',
          color: 'white',
          padding: '0.5rem 1rem',
          fontWeight: '500',
          cursor: 'pointer',
          fontSize: '0.9rem',
        }}
      >
        📱 Install App
      </button>
    </div>
  );
}
