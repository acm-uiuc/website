import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resources | ACM@UIUC',
  description:
    'Learn about all ACM has to offer, from membership perks to support resources!',
  icons: [{ url: 'https://static.acm.illinois.edu/square-blue.png' }],
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
