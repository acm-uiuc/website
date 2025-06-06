'use client';
import Link from 'next/link';
import NextImage from 'next/image';
import Transition from '@/components/Transition';

const mailToUrl =
  'mailto:corporate@acm.illinois.edu?subject=%5BCOMPANY%20NAME%5D%20Interest%20in%20ACM%20%40%20UIUC';

type SponsorEntry = {
  name: string;
  url: string;
  logo: string;
};
const sponsors: SponsorEntry[] = [];

function Sponsors() {
  return (
    <>
      <Transition bgClass="bg-surface-100" />
      <section id="sponsors" className="bg-surface-100 pt-6 pb-24">
        <div className="container flex flex-col gap-6">
          <h1>{sponsors.length > 0 ? 'Sponsors' : 'Sponsor Us'}</h1>
          <p className="text-xl max-w-prose">
            {sponsors.length > 0 &&
              'ACM is thankful to these generous companies who support our organization.'}{' '}
            Sponsor companies get access to our resume book, ability to hold
            sponsored events, and other cool benefits! If you&apos;re interested
            in sponsoring ACM @ UIUC, please{' '}
            <Link
              href={mailToUrl}
              className="underline text-primary hover:text-secondary"
            >
              contact us
            </Link>
            .
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
            {sponsors.length > 0 &&
              sponsors.map((x) => (
                <a href={x.url} target="_blank" rel="noopener noreferrer">
                  <NextImage
                    className="w-full h-auto"
                    src={x.logo}
                    alt={`${x.name} logo`}
                    loading="lazy"
                  />
                </a>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Sponsors;
