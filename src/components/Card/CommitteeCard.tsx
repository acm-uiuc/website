import NextImage, { StaticImageData } from 'next/image';
import { BsEnvelope } from 'react-icons/bs';

import ExtLink from '@/components/Link';

interface ChairProps {
  name: string;
  email: string;
};

interface CommitteeProps {
  title: string;
  description: string;
  image: StaticImageData;
  href?: string;
  chairs?: ChairProps[];
};

export default function CommitteeCard({
  title,
  description,
  image,
  href,
  chairs
}: CommitteeProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4 rounded-3xl bg-surface-100 border-2 border-color-150">
      <div className="lg:basis-2/5 flex flex-col items-center">
        <NextImage
          className="rounded-2xl max-h-64 w-auto"
          src={image}
          alt=""
        />
      </div>
      <div className="lg:basis-3/5 flex flex-col">
        <div>
          <h2>
            {href ? (
              <ExtLink href={href}>
                {title}
              </ExtLink>
            ) : (
              <>{title}</>
            )}
          </h2>
          <p>{description}</p>
          {chairs ? (
            <>
              <p className="mt-4 text-2xl font-bold">
                {chairs.length > 1 ? "Chairs" : "Chair"}
              </p>
              <ul className="flex flex-col gap-1">
                {chairs.map((chair, i) => (
                  <li key={i} className="flex flex-row gap-2 items-center">
                    <a
                      className="p-1 rounded-md text-primary hover:bg-surface-150 transition-all"
                      href={`mailto:${chair.email}`}
                      title="Email"
                    >
                      <BsEnvelope className="w-5 h-5" />
                    </a>
                    <p className="text-lg">{chair.name}</p>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};