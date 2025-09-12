import Link from 'next/link';
import ExtLink from '@/components/Link';

import Transition from '@/components/Transition';
import CommitteeSection from '@/sections/about/CommitteeSection';
import LeadershipSection from '@/sections/about/LeadershipSection';

export default function About() {
  return (
    <>
      <div className="h-5 bg-primary-300 flex" />
      <Transition bgClass="bg-surface-000" />
      <div className="flex flex-col gap-8 bg-surface-000 pt-6 pb-24">
        <section id="about" className="container flex flex-col gap-4">
          <h1>About Us</h1>
          <p>
            ACM@UIUC is the{' '}
            <ExtLink href="https://www.acm.org/">
              Association for Computing Machinery
            </ExtLink>{' '}
            student chapter, the world&apos;s largest scientific computer
            society. We are a group of dedicated people interested in exploring
            the possibilities of computers and discovering new ways to use them!
          </p>
          <p>
            ACM contains Special Interest Groups, or SIGs, which focus on
            specific applications of computer science. In our chapter, each SIG
            operates under ACM@UIUC with free range over its meetings,
            activities, and purpose. Some SIGs are project-based and devote time
            to building something innovative or spectacular to showcase. Others
            are dedicated to teaching, using talks and workshops to help their
            members understand a particular topic. You can learn more about each
            SIG on our{' '}
            <Link
              href="/"
              className="text-primary hover:text-secondary transition-all"
            >
              home page
            </Link>
            !
          </p>
          <p>
            ACM@UIUC also runs various events throughout the year, such as ACM
            Open House, which showcases all the different SIGs at the beginning
            of each semester,{' '}
            <ExtLink href="https://www.reflectionsprojections.org/">
              Reflections | Projections
            </ExtLink>
            , our annual computing conference, and{' '}
            <ExtLink href="https://hackillinois.org/">HackIllinois</ExtLink>,
            which is one of the largest hackathons in the nation. We also host a
            variety of outreach and social events, such as picnics, activity
            weeks, ACM Happy Hour, and our annual bar crawl. Our SIGs also run
            their own events! These events are open to all of UIUC, regardless
            of technical experience or background!
          </p>
          <p>
            Our executive meetings occur every other week and are open to the
            public. The ACM officer board, as well as SIG and committee leads,
            drive discussion about important ACM matters and make decisions
            based on the consensus of meeting attendees.
          </p>
          <p>
            Corporate inquiries should be directed to{' '}
            <ExtLink href="mailto:corporate@acm.illinois.edu">
              corporate@acm.illinois.edu
            </ExtLink>{' '}
            and{' '}
            <ExtLink href="mailto:officers@acm.illinois.edu">
              officers@acm.illinois.edu
            </ExtLink>
            .
          </p>
          <p>ACM@UIUC is a registered 501(c)(3) nonprofit organization.</p>
        </section>
        <LeadershipSection />
        <CommitteeSection />
      </div>
    </>
  );
}
