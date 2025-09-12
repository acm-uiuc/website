import Transition from '@/components/Transition';

function NavLink({
  children,
  ...rest
}: { children: React.ReactNode } & React.HTMLProps<HTMLAnchorElement>) {
  return (
    <a
      className="font-medium py-4 border-b-3 border-transparent hover:border-white transition-all"
      target="_blank"
      rel="noopener noreferrer"
      {...rest}
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <>
      <Transition bgClass="bg-primary-300" />
      <div className="bg-primary-300 text-white text-center p-6">
        <div className="flex flex-col gap-4 items-center">
          <p className="text-2xl font-bold">Connect with ACM @ UIUC</p>
          <div className="flex flex-col sm:flex-row gap-x-8 gap-y-4 items-center">
            <NavLink href="https://go.acm.illinois.edu/discord">
              Discord
            </NavLink>
            <NavLink href="https://www.linkedin.com/company/acm-uiuc">LinkedIn</NavLink>
            <NavLink href="https://instagram.com/acm.uiuc">Instagram</NavLink>
            <NavLink href="https://github.com/acm-uiuc">GitHub</NavLink>
          </div>
        </div>
      </div>
    </>
  );
}
