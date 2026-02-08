import { useState, useEffect } from 'preact/hooks';
import { Fragment } from 'preact/jsx-runtime';

interface Breadcrumb {
  href: string;
  label: string;
}

interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

interface NavbarProps {
  transparent?: boolean;
  mode?: 'dark' | 'light';
  breadcrumbs?: Breadcrumb[];
  currentPath: string;
}

const navLinks: NavLink[] = [
  { href: '/about', label: 'About' },
  { href: '/calendar', label: 'Calendar' },
  { href: '/store', label: 'Store' },
  { href: '/resources', label: 'Resources' },
  { href: 'https://illinoiscs.wiki', label: 'Wiki', external: true },
];

export default function ReactNavbar({
  transparent = false,
  mode = 'dark',
  breadcrumbs,
  currentPath = '',
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle Scroll Logic
  useEffect(() => {
    const handleScroll = () => {
      if (transparent) {
        setIsScrolled(window.scrollY > 50);
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [transparent]);

  // Determine visual state
  const isSolid = !transparent || isScrolled || isMobileMenuOpen;

  // Text colors based on state
  const isDarkText = mode === 'light' || isSolid;

  const baseTextClass = isDarkText
    ? 'text-navy-700 hover:text-navy-900 hover:bg-navy-100'
    : 'text-white/90 hover:text-white hover:bg-white/10';

  const activeTextClass = isDarkText
    ? 'text-navy-900 bg-navy-100'
    : 'text-white bg-white/10';

  const breadcrumbCurrentClass = isDarkText ? 'text-navy-900' : 'text-white';
  const breadcrumbLinkClass = isDarkText
    ? 'text-navy-600 hover:text-navy-900'
    : 'text-white/80 hover:text-white';

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isSolid ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <a href="/" className="flex shrink-0 items-center">
            {/* White Banner (Visible only in Dark Mode + Transparent) */}
            <img
              src="/images/banner-white.png"
              alt="ACM @ UIUC"
              className={`navbar-logo h-12 w-auto transition-opacity lg:h-14 ${
                isDarkText ? 'hidden' : 'block'
              }`}
            />
            {/* Blue/Dark Banner (Visible in Light Mode or Solid State) */}
            <img
              src="/images/banner-blue.png"
              alt="ACM @ UIUC"
              className={`navbar-logo-dark h-12 w-auto lg:h-14 ${
                isDarkText ? 'block' : 'hidden'
              }`}
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive =
                currentPath.startsWith(link.href) && !link.external;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className={`rounded-lg px-4 py-2 text-lg font-medium transition-colors ${
                    isActive ? activeTextClass : baseTextClass
                  }`}
                >
                  {link.label}
                  {link.external && (
                    <svg
                      className="ml-1 inline-block h-3 w-3 opacity-50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  )}
                </a>
              );
            })}
          </div>

          {/* CTA Button or Breadcrumbs */}
          <div className="hidden items-center gap-4 lg:block">
            {breadcrumbs && breadcrumbs.length > 0 ? (
              <nav className="flex items-center gap-2" aria-label="Breadcrumb">
                {breadcrumbs.map((crumb, index) => (
                  <Fragment key={index}>
                    {index > 0 && (
                      <svg
                        className={`h-4 w-4 flex-shrink-0 ${isDarkText ? 'text-navy-300' : 'text-white/50'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    )}
                    {index === breadcrumbs.length - 1 ? (
                      <span
                        className={`text-sm font-medium ${breadcrumbCurrentClass}`}
                      >
                        {crumb.label}
                      </span>
                    ) : (
                      <a
                        href={crumb.href}
                        className={`text-sm font-medium transition-colors hover:underline ${breadcrumbLinkClass}`}
                      >
                        {crumb.label}
                      </a>
                    )}
                  </Fragment>
                ))}
              </nav>
            ) : (
              <a
                href="/join"
                className="bg-tangerine-500 hover:bg-tangerine-600 text-md rounded-lg px-6 py-2.5 font-semibold text-white shadow-sm transition-all hover:shadow-md"
              >
                Join Now
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`rounded-lg p-2 transition-colors md:hidden ${
              isDarkText
                ? 'text-navy-700 hover:bg-navy-100'
                : 'text-white hover:bg-white/10'
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="pb-4 md:hidden">
            <div className="flex flex-col gap-1 border-t border-gray-200 pt-2">
              {navLinks.map((link) => {
                const isActive =
                  currentPath.startsWith(link.href) && !link.external;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className={`rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                      isActive ? activeTextClass : baseTextClass
                    }`}
                  >
                    {link.label}
                    {link.external && (
                      <svg
                        className="ml-1 inline-block h-3 w-3 opacity-50"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    )}
                  </a>
                );
              })}
              <a
                href="/join"
                className="bg-tangerine-500 hover:bg-tangerine-600 mt-2 rounded-lg px-4 py-3 text-center text-base font-semibold text-white transition-colors"
              >
                Join Now
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
