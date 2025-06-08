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
    content: '#ffffff',
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
  return <Outlet />;
}
