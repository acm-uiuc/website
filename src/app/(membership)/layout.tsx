import { Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
};

export default function MembershipLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
