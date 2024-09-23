'use client';

import Script from 'next/script';
import Hero from '@/components/Hero';
import NewsletterPopup from '@/components/NewsletterPopup';
import Sponsors from '@/components/Sponsors';
import Transition from '@/components/Transition';
import Sigscard from '@/sections/home/Sigscard';
import { useEffect, useState } from 'react';
import { IEvent } from '@/components/Events/events';
import moment from 'moment';
import { getEventsAfter } from '@/utils/dateutils';
import { AllSigData } from '@/utils/organizations';
import { fetchUpcomingEvents } from '@/utils/api';

export default function Home() {
  return (
    <>
      {/* Redirects old hash router links to normal routes (e.g. /#/membership -> /membership) */}
      <NewsletterPopup/>
      <section id="sighighlight" className="bg-surface-050 pt-6 pb-24" style={{height: "100%"}}>
        <div className="flex flex-col gap-4 lg:flex-row pt-8 container flex flex-col gap-6" >
          <h1>
            Reddit Verification
          </h1>
          <p className="text-xl max-w-prose">
            This page serves to verify that Reddit user <code><a href="https://www.reddit.com/user/YoBacon4Bacon/">u/YoBacon4Bacon</a></code> belongs to Ryan To, ACM@UIUC Treasurer/Officer Board member for the 2024-2025 Academic Year. ACM@UIUC is the parent organization for HackIllinois.
          </p>
        </div>
      </section>
      {/* <Sponsors /> */}
    </>
  );
};