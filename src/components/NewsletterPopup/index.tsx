'use client';
import { useEffect, useState } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import config from "@/config.json"

import styles from './index.module.css';

export default function NewsletterPopup() {
  const [closedPopup, setClosedPopup] = useState(false);
  const [appear, setAppear] = useState(true);

  useEffect(() => {
    const listenToScroll = () => {
      let hiddenHeight = 200;
      const winScroll =
        document.body.scrollTop || document.documentElement.scrollTop;
      if (winScroll > hiddenHeight) {
        setAppear(false);
      } else {
        setAppear(true);
      }
    };
    window.addEventListener('scroll', listenToScroll);
    return () => window.removeEventListener('scroll', listenToScroll);
  }, []);

  if (!closedPopup) {
    return (
      <div
        className={`hidden lg:flex flex-col fixed w-[240px] text-center text-base p-2 z-10 right-4 bg-surface-100 border-2 border-surface-150 rounded-2xl hover:shadow-2xl ${styles.popup}`}
        style={{ bottom: appear ? '1rem' : '-100%' }}
      >
        <button
          className="self-end"
          onClick={() => {
            setClosedPopup(true);
          }}
        >
          <FaRegTimesCircle className="h-6 w-6" />
        </button>
        <p className="mb-2">
          Interested in receiving updates via email? Click below to subscribe to
          our newsletter!
        </p>
        <a
          className="flex flex-col w-full p-2 items-center text-white text-center rounded-full bg-yale_blue hover:bg-secondary transition-all"
          href={config.mailingListSignup}
          target="_blank"
          rel="noopener noreferrer"
        >
          Subscribe
        </a>
      </div>
    );
  }
  return null;
}
