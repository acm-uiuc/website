import type { Organization } from '../stores/organization';
import { Globe, Link, Mail } from 'lucide-react';
import type { JSX } from 'preact/jsx-runtime';
import {
  SiDiscord,
  SiGithub,
  SiInstagram,
  SiSlack,
} from '@icons-pack/react-simple-icons';
import { acronyms, toTitleCase } from '../util';

interface ImageData {
  src: string;
  width: number;
  height: number;
}

const OrganizationCard = ({
  organization,
  imageData,
}: {
  organization: Organization;
  imageData?: ImageData;
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

  const badgeColors: Record<string, string> = {
    sig: 'bg-blue-100 text-blue-800',
    committee: 'bg-orange-100 text-orange-800',
  };

  const allLinks = [
    { type: 'WEBSITE', url: organization.website },
    ...(organization.links || []),
  ].filter((x) => !!x && x.type && x.url);
  return (
    <div class="group relative flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 text-center transition-all duration-200 hover:border-navy-300 hover:shadow-lg">
      <div
        class={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full ${badgeColors[organization.type] || 'bg-gray-100 text-gray-800'}`}
      >
        {acronyms.includes(organization.type.toUpperCase())
          ? organization.type.toUpperCase()
          : toTitleCase(organization.type)}
      </div>

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
