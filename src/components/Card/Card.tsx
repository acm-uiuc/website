import { getOrganizationImage, LazyImageProps, Organization } from '@/components/LazyImage';

interface CardProps {
  title: Organization
  description: string
  link1?: string
  link2?: string
  link3?: string
  linktext1?: string
  linktext2?: string
  linktext3?: string
};

export default function Card({ 
  title,
  description,
  link1,
  link2,
  link3,
  linktext1,
  linktext2,
  linktext3,
}: CardProps) {
  return (
    <div className="flex flex-col p-4 items-center rounded-3xl border-2 border-surface-150 hover:bg-surface-000 hover:border-transparent hover:shadow-xl hover:-translate-y-[1px] transition-all">
      {getOrganizationImage(title)}
      <div className="flex flex-col grow mb-4">
        <h2 className="text-center">{title}</h2>
        <p className="leading-6">{description}</p>
      </div>
      <div className="flex flex-row w-full justify-between items-end">
        {link1 && linktext1 ? (
          <a
            className="font-medium p-1 rounded-md text-primary hover:bg-surface-100 transition-all"
            href={link1}
            target="_blank"
            rel="noopener noreferrer"
          >
            {linktext1}
          </a>
        ) : <div />}
        {link2 && linktext2 ? (
          <a
            className="font-medium p-1 rounded-md text-primary hover:bg-surface-100 transition-all"
            href={link2}
            target="_blank"
            rel="noopener noreferrer"
          >
            {linktext2}
          </a>
        ) : null}
        {link3 && linktext3 ? (
          <a
            className="font-medium p-1 rounded-md text-primary hover:bg-surface-100 transition-all"
            href={link3}
            target="_blank"
            rel="noopener noreferrer"
          >
            {linktext3}
          </a>
        ) : null}
      </div>
    </div>
  );
};