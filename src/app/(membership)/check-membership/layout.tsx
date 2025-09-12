import { Metadata } from "next";
import { DM_Sans } from 'next/font/google';

const dm_sans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-dm-sans',
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: "ACM @ UIUC Membership",
  description: "Verify your ACM @ UIUC paid membership status, and add your membership card to your mobile wallet."
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // add CF web analytics script
  return (
    <>
      <html lang="en" className={dm_sans.variable}>
        <script
          defer
          async
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "09fe6ae0a5fd498bac829b586599e1d8"}'
        ></script>
        <body>{children}</body>
      </html>
    </>
  );
}
