import { h, type TargetedEvent } from 'preact';
import type { Organization } from '../stores/organization';
import {
  Globe,
  MessageSquare,
  Mail,
  GitBranch,
  Camera,
  Code,
} from 'lucide-react';
import { SiDiscord } from '@icons-pack/react-simple-icons';

interface Props {
  organization: Organization;
}

const linkIconMap: Record<string, h.JSX.Element> = {
  WEBSITE: <Globe size={18} />,
  DISCORD: <SiDiscord size={18} />,
  SLACK: <MessageSquare size={18} />,
  INSTAGRAM: <Camera size={18} />,
  GITHUB: <GitBranch size={18} />,
  EMAIL: <Mail size={18} />,
  OTHER: <Code size={18} />,
};

const badgeColors: Record<string, string> = {
  sig: 'bg-blue-100 text-blue-800',
  committee: 'bg-orange-100 text-orange-800',
};

const OrganizationCard = ({ organization }: Props) => {
  const logoUrl = `/images/logos/${organization.id}.png`;

  const handleImageError = (e: TargetedEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
  };
  const allLinks = [
    { type: 'WEBSITE', url: organization.website },
    ...(organization.links || []),
  ].filter((x) => !!x && x.type && x.url);
  return (
    <div class="group relative flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 text-center transition-all duration-200 hover:border-navy-300 hover:shadow-lg">
      <div
        class={`absolute top-3 right-3 text-xs font-bold capitalize px-2 py-1 rounded-full ${badgeColors[organization.type] || 'bg-gray-100 text-gray-800'}`}
      >
        {organization.type}
      </div>

      <div class="mb-4">
        <img
          src={logoUrl}
          alt={`${organization.name} logo`}
          class="h-24 w-24 rounded-full object-cover mx-auto transition-transform duration-200 group-hover:scale-110"
          onError={handleImageError}
        />
        <div
          class="hidden h-24 w-24 items-center justify-center rounded-full bg-gray-100 mx-auto"
          style="display: none;"
        >
          <span class="text-4xl font-bold text-gray-500">
            {organization.name.charAt(0)}
          </span>
        </div>
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
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.type}
                class="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-navy-700"
              >
                {linkIconMap[link.type] || <Code size={18} />}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationCard;
