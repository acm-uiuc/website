export default function ExtLink({
  children,
  ...rest
}: { children: React.ReactNode } & React.HTMLProps<HTMLAnchorElement>) {
  return (
    <a
      className="text-primary hover:text-secondary transition-all"
      target="_blank"
      rel="noopener noreferrer"
      {...rest}
    >
      {children}
    </a>
  );
}
