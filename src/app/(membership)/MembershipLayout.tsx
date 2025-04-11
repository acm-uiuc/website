'use client';
import Link from 'next/link';
import NextImage from 'next/image';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  HeroUIProvider,
} from '@heroui/react';

import acmlogo from './acmlogo.png';

export declare interface LayoutProps {
  children?: React.ReactElement;
  name?: string;
}

const prod = Boolean(process.env.NEXT_PUBLIC_RUN_ENV === 'prod');

const Layout = (props: LayoutProps) => {
  return (
    <HeroUIProvider className="enable-tailwind">
      <Navbar>
        <NavbarBrand>
          <Link href="/">
            <NextImage alt="ACM Logo" src={acmlogo} style={styles.logo} />
          </Link>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex" justify="center">
          {prod ? null : <a style={{ color: 'red' }}>DEVELOPMENT MODE</a>}
        </NavbarContent>
        <NavbarContent className="hidden sm:flex" justify="end">
          <NavbarItem>
            <Link href="/">Home</Link>
          </NavbarItem>
          <NavbarItem isActive aria-current="page">
            {props.name ? props.name : 'Membership'}
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      {props.children}
    </HeroUIProvider>
  );
};

const styles = {
  logo: {
    maxHeight: '50px',
    width: 'auto',
    padding: '5px 7px 0px 8px',
    borderRadius: '0.75em',
  },
};

export default Layout;
