import {
  SiDiscord,
  SiGithub,
  SiInstagram,
  SiSlack,
} from '@icons-pack/react-simple-icons';
import { Globe, Link, Mail, RotateCcw } from 'lucide-react';
import type { JSX } from 'preact/jsx-runtime';
import { useState } from 'preact/hooks';

import type { Organization } from '../stores/organization';
import { toTitleCase } from '../util';

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
  const [isFlipped, setIsFlipped] = useState(false);
  const [showBack, setShowBack] = useState(false);

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
    ...(organization.email
      ? [{ type: 'EMAIL', url: `mailto:${organization.email}` }]
      : []),
  ].filter((x) => Boolean(x) && x.type && x.url);

  const leads = organization.leads || [];

  return (
    <div
      className={`flip-card group animate-fade-up`}
      style={{ animationDelay: `${index * 50}ms` }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          (e.currentTarget as HTMLElement).click();
        }
      }}
      onClick={() => {
        const next = !isFlipped;
        if (next) {
          setShowBack(true);
        } else if (
          window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
          setShowBack(false);
        }
        setIsFlipped(next);
      }}
    >
      <div
        className="flip-card-inner"
        style={{ transform: isFlipped ? 'rotateY(180deg)' : 'none' }}
        onTransitionEnd={(e) => {
          if (
            e.target === e.currentTarget &&
            (e as TransitionEvent).propertyName === 'transform' &&
            !isFlipped
          ) {
            setShowBack(false);
          }
        }}
      >
        {/* Front face */}
        <div
          className={`flip-card-front relative flex h-full flex-col rounded-xl border border-gray-200 border-t-2 border-t-transparent bg-white p-6 text-center shadow-md transition-colors duration-200 hover:shadow-xl ${topBorderColors[organization.type] || ''}`}
          aria-hidden={isFlipped ? true : undefined}
        >
          <div className="mb-4">
            <img
              src={logoUrl}
              alt={`${organization.name} logo`}
              width={imageData?.width || 96}
              height={imageData?.height || 96}
              loading="lazy"
              className="h-24 w-24 rounded-md object-contain mx-auto transition-transform duration-200 group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <div className="flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-navy-900 mb-2 group-hover:text-navy-700">
              {organization.name}
            </h3>
            <p className="text-md text-gray-600 line-clamp-8 lg:line-clamp-5 flex-1">
              {organization.description}
            </p>
          </div>

          {allLinks.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-center gap-2">
                {allLinks.map((link) => (
                  <a
                    key={`${organization.id}-${link.type}-${link.url}`}
                    href={link.url}
                    {...(link.type !== 'EMAIL' && {
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    })}
                    title={toTitleCase(link.type)}
                    className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-navy-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {linkIconPaths[link.type] || linkIconPaths.OTHER}
                  </a>
                ))}
              </div>
            </div>
          )}
          <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-gray-400 animate-flip-hint">
            <span className="text-[10px] font-medium sm:hidden">Tap</span>
            <span className="text-[10px] font-medium hidden sm:inline">
              Click
            </span>
            <RotateCcw size={12} />
          </span>
        </div>

        {/* Back face */}
        <div
          className={`flip-card-back relative rounded-xl border border-gray-200 border-t-2 border-t-transparent bg-white p-6 text-center shadow-md transition-colors duration-200 hover:shadow-xl ${topBorderColors[organization.type] || ''}`}
          style={showBack ? { visibility: 'visible' } : undefined}
          aria-hidden={isFlipped ? undefined : true}
        >
          <h3 className="text-lg font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Leadership
          </h3>

          <div className="flex-1 overflow-y-auto mb-6">
            {leads.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                {leads.map((lead) => (
                  <li
                    key={lead.username}
                    className="rounded-lg bg-gray-50 px-3 py-2"
                  >
                    <p className="text-sm font-medium text-navy-900">
                      {lead.name || lead.username}
                    </p>
                    {lead.title && (
                      <p className="text-xs text-gray-500">{lead.title}</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 italic mt-4">
                No leads listed
              </p>
            )}
          </div>

          <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-gray-400">
            <span className="text-[10px] font-medium sm:hidden">Tap</span>
            <span className="text-[10px] font-medium hidden sm:inline">
              Click
            </span>
            <RotateCcw size={12} />
          </span>
        </div>
      </div>
    </div>
  );
};
export default OrganizationCard;
