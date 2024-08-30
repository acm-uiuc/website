import { Metadata, Viewport } from 'next';
import { DM_Sans } from 'next/font/google';

import '@/styles/global.css';

export const metadata: Metadata = {
  title: 'ACM@UIUC',
  description: "ACM is UIUC's largest CS student organization.",
  icons: [
    { url: 'https://acm-brand-images.s3.amazonaws.com/square-blue.png' },
  ]
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  themeColor: '#0053B3'
};

const dm_sans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-dm-sans',
  weight: ['400', '500', '700']
});

export default function RootLayout({ children } : { children: React.ReactNode }) {
  // add CF web analytics script
  return (
    <>
    <html lang="en" className={dm_sans.variable}>
    <script defer async src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "09fe6ae0a5fd498bac829b586599e1d8"}'></script>
      <body>
        {children}
      </body>
    </html>
    </>
  );
};