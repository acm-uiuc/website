import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Calendar | ACM@UIUC',
    description: "Stay up-to-date with all events from ACM@UIUC, including activities from SIGs and committees.",
    icons: [
      { url: 'https://static.acm.illinois.edu/square-blue.png' },
    ]
};

export default function CalendarLayout({ children } : { children: React.ReactNode }) {
    return (
      <>
        {children}
      </>
    );
  };