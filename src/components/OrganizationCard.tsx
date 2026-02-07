import {
  SiDiscord,
  SiGithub,
  SiInstagram,
  SiSlack,
} from '@icons-pack/react-simple-icons';
import { Globe, Link, Mail } from 'lucide-react';
import type { JSX } from 'preact/jsx-runtime';

import type { Organization } from '../stores/organization';
import { acronyms, toTitleCase } from '../util';

interface ImageData {
  src: string;
  width: number;
  height: number;
}

const OrganizationCard = ({
  organization,
  imageData,
  index = 0,
}: {
  organization: Organization;
  imageData?: ImageData;
  index?: number;
}) => {
  // Use optimized image if available, fallback to public folder
  const logoUrl = imageData?.src || `/images/logos/${organization.id}.png`;
  const commonIconProps = { size: 16 };
  const linkIconPaths: Record<string, JSX.Element> = {
    WEBSITE: <Globe {...commonIconProps} />,
    DISCORD: <SiDiscord {...commonIconProps} />,
    SLACK: <SiSlack {...commonIconProps} />,
    INSTAGRAM: <SiInstagram {...commonIconProps} />,
    GITHUB: <SiGithub {...commonIconProps} />,
    EMAIL: <Mail {...commonIconProps} />,
    OTHER: <Link {...commonIconProps} />,
  };

  const topBorderColors: Record<string, string> = {
    sig: 'group-hover:border-t-blue-400',
    committee: 'group-hover:border-t-orange-400',
  };

  const allLinks = [
    { type: 'WEBSITE', url: organization.website },
    ...(organization.links || []),
  ].filter((x) => Boolean(x) && x.type && x.url);
  return (
    <div
      class={`group relative flex h-full flex-col rounded-xl border border-gray-200 border-t-2 border-t-transparent bg-white p-6 text-center shadow-md transition-all duration-200 hover:border-navy-300 hover:shadow-xl hover:-translate-y-0.5 ${topBorderColors[organization.type] || ''} animate-fade-up`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div class="mb-4">
        <img
          src={logoUrl}
          alt={`${organization.name} logo`}
          width={imageData?.width || 96}
          height={imageData?.height || 96}
          loading="lazy"
          class="h-24 w-24 rounded-full object-cover mx-auto transition-transform duration-200 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      <div class="flex-1 flex flex-col">
        <h3 class="text-xl font-bold text-navy-900 mb-2 group-hover:text-navy-700">
          {organization.name}
        </h3>
        <p class="text-md text-gray-600 line-clamp-4 flex-1">
          {organization.description}
        </p>
      </div>

      {allLinks.length > 0 && (
        <div class="mt-4 pt-4 border-t border-gray-100">
          <div class="flex items-center justify-center gap-2">
            {allLinks.map((link) => (
              <a
                key={`${organization.id}-${link.type}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={toTitleCase(link.type)}
                class="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-navy-700"
              >
                {linkIconPaths[link.type] || linkIconPaths.OTHER}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default OrganizationCard;
