'use client';
import Link, { LinkProps } from 'next/link';
import { useRef } from 'react';
import DevModePopup from '../DevModePopup';

import styles from './index.module.css';

function NavLink({ children, ...rest }: { children: React.ReactNode } & LinkProps) {
  return (
    <Link
      className="font-medium py-4 border-b-3 border-transparent hover:border-white transition-all"
      {...rest}
    >
      {children}
    </Link>
  );
}
const prod = Boolean(process.env.NEXT_PUBLIC_RUN_ENV === 'prod');

export default function Navbar() {
  const checkbox = useRef<HTMLInputElement | null>(null);

  const uncheck = () => {
    if (checkbox && checkbox.current != null) {
      checkbox.current.checked = false;
    }
  };

  return (
    <div className="bg-acmdark text-white">
      {!prod ? <DevModePopup/> : null}
      <div className="relative">
        <header className="container flex flex-row justify-between py-4">
          <Link href="/">
            <img src="https://acm-brand-images.s3.amazonaws.com/banner-white.png" alt="ACM@UIUC" height="104px" width="202px"/>
          </Link>

          <div className="flex items-center">
            <input
              className={`hidden peer ${styles.sideMenu}`}
              type="checkbox"
              id="side-menu"
              ref={checkbox}
            />
            <label
              className={`flex items-center h-8 w-8 lg:hidden ${styles.hamb}`}
              htmlFor="side-menu"
              tabIndex={0}
            >
              <span className={styles.hambLine}></span>
            </label>
            <nav
              className="z-50 absolute left-0 top-full w-full h-0 overflow-hidden lg:flex lg:relative lg:top-0 lg:h-auto lg:overflow-visible peer-checked:max-lg:h-screen peer-checked:max-lg:bg-acmdark"
              style={{transition: "all 0.2s ease-out"}}
            >
              <ul className="flex flex-col lg:flex-row my-4 gap-x-6 gap-y-12 p-4 max-lg:container">
                <li>
                  <NavLink
                    href="/about"
                    onClick={uncheck}
                  >
                    About
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    href="/calendar"
                    onClick={uncheck}
                  >
                    Calendar
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    href="/#sighighlight"
                    onClick={uncheck}
                  >
                    SIGs
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    href="/about/#reflections"
                    onClick={uncheck}
                  >
                    Reflections | Projections
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    href="/about/#hackillinois"
                    onClick={uncheck}
                  >
                    HackIllinois
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    href="/#sponsors"
                    onClick={uncheck}
                  >
                    Sponsors
                  </NavLink>
                </li>
                <li>
                <NavLink
                    href="/merch-store"
                    onClick={uncheck}
                  >
                    Merch
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </header>
      </div>
    </div>
  );
};