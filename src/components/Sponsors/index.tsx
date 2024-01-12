import NextImage from 'next/image';
import Transition from '@/components/Transition';

import NumeradeLogo from './Numerade_Logo.png';
import IMCLogo from './IMC_logo.svg';

function Sponsors() {
  return (
    <>
      <Transition bgClass="bg-surface-100" />
      <section id="sponsors" className="bg-surface-100 pt-6 pb-24">
        <div className="container flex flex-col gap-6">
          <h1>
            Sponsors
          </h1>
          <p className="text-xl max-w-prose">
            ACM is thankful to these generous companies who support our
            organization. Sponsor companies get access to our resume book and
            some other cool things. If you&apos;re interested in sponsoring ACM,
            contact the Corporate chair at <a href="mailto:anishm2@illinois.edu" className="text-primary hover:text-secondary">anishm2@illinois.edu</a>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
            <a
              href="https://numerade.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <NextImage
                className="w-full h-auto"
                src={NumeradeLogo}
                alt="Numerade Logo"
                loading="lazy" 
              />
            </a>
            <a
              href="https://imc.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <NextImage
                className="w-full h-auto"
                src={IMCLogo}
                alt="IMC Logo"
                loading="lazy"
              />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Sponsors;
