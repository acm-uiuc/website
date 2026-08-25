import { useEffect, useState } from 'preact/hooks';
import type { OHOrgData } from './data/oh_config';
import VenueMap from './VenueMap';
import {
  collectFixtures,
  type AssignmentConfig,
  type VenueLayoutConfig,
} from './data/layout';
import tablesConfigDataRaw from './data/tables_config.json';
import assignmentsConfigDataRaw from './data/assignments_config.json';

// Default imports, not `import * as`: a namespace object carries a `default`
// key alongside the JSON keys, which breaks anything that iterates the config.
const layoutConfig = tablesConfigDataRaw as unknown as VenueLayoutConfig;
const assignmentsConfig =
  assignmentsConfigDataRaw as unknown as AssignmentConfig;

/** Non-booth map items, keyed the same way the map keys its placements. */
const fixturesByKey = collectFixtures(assignmentsConfig);

interface BoothDetail {
  name: string;
  description: string;
  links?: { text: string; url: string }[];
}

/**
 * A selection is either an org ID or a fixture key. Fixture keys look like
 * `center-2`, so they cannot collide with the `S##`/`C##`/`P##` org IDs.
 */
function resolveDetail(
  selected: string,
  orgsData: Record<string, OHOrgData>
): BoothDetail | null {
  const org = orgsData[selected];
  if (org) {
    return { name: org.name, description: org.description, links: org.links };
  }
  const fixture = fixturesByKey[selected];
  if (fixture?.description) {
    return {
      name: fixture.label,
      description: fixture.description,
      links: fixture.links,
    };
  }
  return null;
}

type OrgType = 'committee' | 'sig' | 'partner';

/** Collapsible sections in the directory below the map. */
type SectionKey = OrgType | 'demos';

const boothSections: { title: string; type: OrgType }[] = [
  { title: 'Special Interest Groups', type: 'sig' },
  { title: 'Committees', type: 'committee' },
  { title: 'Partners', type: 'partner' },
];

interface SectionHeaderProps {
  title: string;
  count: number;
  collapsed: boolean;
  onToggle: () => void;
}

/**
 * Collapsible section heading. The heading wraps a real button rather than
 * carrying the click itself, which keeps the document outline while giving the
 * toggle proper keyboard and screen-reader behaviour.
 */
const SectionHeader = ({
  title,
  count,
  collapsed,
  onToggle,
}: SectionHeaderProps) => (
  <h3>
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={!collapsed}
      className="group flex w-full cursor-pointer items-baseline gap-3 border-b border-surface-150 pb-2 text-left transition-colors hover:border-navy-200"
    >
      <span className="text-sm font-semibold tracking-[0.12em] text-navy-700 uppercase transition-colors group-hover:text-navy-900">
        {title}
      </span>
      <span className="text-xs text-gray-400 tabular-nums">{count}</span>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={`ml-auto size-4 self-center text-gray-400 transition-transform duration-300 group-hover:text-navy-600 ${
          collapsed ? '-rotate-90' : ''
        }`}
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  </h3>
);

interface BoothSectionProps {
  title: string;
  type: OrgType;
  orgsData: Record<string, OHOrgData>;
  collapsed: boolean;
  onToggle: () => void;
  selectedBooth: string | null;
  handleBoothSelect: (booth: string) => void;
}

const BoothSection = ({
  title,
  type,
  orgsData,
  collapsed,
  onToggle,
  selectedBooth,
  handleBoothSelect,
}: BoothSectionProps) => {
  const orgIds = Object.keys(orgsData).filter(
    (orgId) => orgsData[orgId].type === type
  );

  return (
    <div className="flex flex-col gap-2">
      <SectionHeader
        title={title}
        count={orgIds.length}
        collapsed={collapsed}
        onToggle={onToggle}
      />
      {!collapsed && (
        <div className="mx-auto flex max-w-7xl flex-wrap items-start justify-center gap-4 p-4 md:gap-2">
          {orgIds.map((orgId) => {
            const org = orgsData[orgId];
            return (
              <button
                key={orgId}
                type="button"
                onClick={() => handleBoothSelect(orgId)}
                aria-pressed={selectedBooth === orgId}
                className="flex w-[90px] cursor-pointer flex-col items-center gap-2 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-600 md:w-[70px] md:gap-1"
              >
                {org.logo ? (
                  <img
                    src={org.logo}
                    alt=""
                    width={90}
                    height={90}
                    loading="lazy"
                    decoding="async"
                    className={`size-[90px] max-h-[90px] max-w-[90px] rounded-xl border-3 object-contain transition-all duration-300 hover:scale-110 md:size-[70px] md:max-h-[70px] md:max-w-[70px] ${
                      selectedBooth === orgId
                        ? 'scale-110 border-navy-500 bg-navy-50 shadow-[0_0_15px_rgba(0,119,255,0.4)]'
                        : 'border-transparent'
                    }`}
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className={`flex size-[90px] items-center justify-center rounded-xl border-3 bg-navy-50 text-2xl font-semibold text-navy-400 transition-all duration-300 hover:scale-110 md:size-[70px] ${
                      selectedBooth === orgId
                        ? 'scale-110 border-navy-500 shadow-[0_0_15px_rgba(0,119,255,0.4)]'
                        : 'border-transparent'
                    }`}
                  >
                    {org.name.charAt(0)}
                  </div>
                )}
                <span className="min-h-[30px] max-w-[90px] text-center text-sm text-navy-700 md:max-w-[70px] md:text-xs">
                  {org.name}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface VenuePageProps {
  orgsData: Record<string, OHOrgData>;
  fixtureImages: Record<string, string>;
}

export default function VenuePage({ orgsData, fixtureImages }: VenuePageProps) {
  const [selectedBooth, setSelectedBooth] = useState<string | null>(null);
  const handleBoothSelect = (booth: string) => {
    if (selectedBooth === booth) {
      setSelectedBooth(null);
      return;
    }
    setSelectedBooth(booth);
  };

  const [collapsedSections, setCollapsedSections] = useState<
    Record<SectionKey, boolean>
  >({
    demos: false,
    committee: false,
    sig: false,
    partner: false,
  });

  const toggleSection = (key: SectionKey) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const demoOrgs = Object.entries(orgsData)
    .filter(([, org]) => org.demo_time != null)
    .sort(([, a], [, b]) =>
      (a.demo_time ?? '') > (b.demo_time ?? '') ? 1 : -1
    );
  const selectedDetail = selectedBooth
    ? resolveDetail(selectedBooth, orgsData)
    : null;

  useEffect(() => {
    if (!selectedDetail) {
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedBooth(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedDetail]);

  return (
    <div className="relative w-full px-4 pt-24 md:px-8 lg:pt-32">
      {/* Work-in-progress notice. Remove this block once the venue layout is
          final — see README. */}
      <div className="mx-auto mb-8 max-w-3xl rounded-xl border-2 border-tangerine-300 bg-tangerine-50 px-5 py-4 text-left">
        <p className="text-lg font-bold text-tangerine-800">Work in progress</p>
        <p className="mt-1 leading-6 text-tangerine-900/80">
          The venue layout is still being finalized. Table positions and
          assignments on this map are not final and will change.
        </p>
      </div>

      {/* Intro */}
      <header className="mx-auto mb-6 max-w-3xl px-4 text-center">
        <h1 className="text-3xl font-bold text-navy-900 sm:text-4xl">
          ACM Open House
        </h1>
        <p className="mt-3 leading-7 text-gray-600">
          Meet the special interest groups, committees, and partner orgs that
          make up ACM @ UIUC and grab some food.
        </p>
      </header>

      <p className="mb-2 text-center text-sm text-gray-500">
        Select a table for details.{' '}
        <span className="sm:hidden">
          Scroll the sideways to see every table.
        </span>
      </p>

      {/* Map */}
      <div className="relative mx-auto w-full">
        <VenueMap
          layoutConfig={layoutConfig}
          assignments={assignmentsConfig}
          orgsData={orgsData}
          fixtureImages={fixtureImages}
          selectedBooth={selectedBooth}
          onSelect={handleBoothSelect}
        />

        {/* Booth details. Fixed to the viewport rather than the map, so the card
            is visible wherever the selection was made — including from the
            directory well below the map. */}
        {selectedDetail && (
          <div
            className="fixed inset-0 z-50 flex animate-[fadeIn_200ms_ease-out] items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booth-detail-title"
            onClick={() => setSelectedBooth(null)}
          >
            <div
              className="w-full max-w-[500px] animate-[scaleIn_200ms_ease-out] rounded-2xl border border-navy-100 bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <h2
                  id="booth-detail-title"
                  className="text-2xl font-bold text-navy-900"
                >
                  {selectedDetail.name}
                </h2>
                <button
                  type="button"
                  className="shrink-0 cursor-pointer rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  onClick={() => setSelectedBooth(null)}
                  aria-label="Close booth details"
                >
                  ✕
                </button>
              </div>
              <p className="leading-7 text-gray-600">
                {selectedDetail.description}
              </p>

              {selectedDetail.links && selectedDetail.links.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {selectedDetail.links.map((link, index: number) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-navy-600 px-4 py-2 text-sm font-medium text-white no-underline transition-colors hover:bg-navy-700"
                    >
                      {link.text}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Booth Type Sections */}
      <div className="mx-auto flex w-[90%] max-w-7xl flex-col gap-3 px-4 pt-4 pb-8">
        {demoOrgs.length > 0 && (
          <div className="flex flex-col gap-2">
            <SectionHeader
              title="Demo Schedule"
              count={demoOrgs.length}
              collapsed={collapsedSections.demos}
              onToggle={() => toggleSection('demos')}
            />
            {!collapsedSections.demos && (
              <div className="px-1 pt-2 pb-4">
                <p className="mb-3 max-w-4xl text-sm leading-6 text-gray-500">
                  Watch demos at the Siebel Center for Computer Science, Room
                  2405.
                </p>
                <ul className="divide-y divide-surface-150">
                  {demoOrgs.map(([orgId, org]) => {
                    const isSelected = selectedBooth === orgId;
                    return (
                      <li key={orgId}>
                        <button
                          type="button"
                          onClick={() => handleBoothSelect(orgId)}
                          aria-pressed={isSelected}
                          className={`flex w-full cursor-pointer items-center gap-3 border-l-2 px-3 py-2.5 text-left transition-colors sm:gap-4 ${
                            isSelected
                              ? 'border-navy-500 bg-navy-50'
                              : 'border-transparent hover:bg-surface-050'
                          }`}
                        >
                          <span className="w-24 shrink-0 text-xs text-gray-500 tabular-nums sm:w-32 sm:text-sm">
                            {org.demo_time}
                          </span>
                          {org.logo ? (
                            <img
                              src={org.logo}
                              alt=""
                              width={28}
                              height={28}
                              loading="lazy"
                              decoding="async"
                              className="size-7 shrink-0 object-contain"
                            />
                          ) : (
                            <span
                              aria-hidden="true"
                              className="flex size-7 shrink-0 items-center justify-center rounded bg-navy-50 text-xs font-semibold text-navy-400"
                            >
                              {org.name.charAt(0)}
                            </span>
                          )}
                          <span className="text-sm font-medium text-navy-800">
                            {org.name}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        )}
        {boothSections.map(({ title, type }) => (
          <BoothSection
            key={type}
            title={title}
            type={type}
            orgsData={orgsData}
            collapsed={collapsedSections[type]}
            onToggle={() => toggleSection(type)}
            selectedBooth={selectedBooth}
            handleBoothSelect={handleBoothSelect}
          />
        ))}
      </div>
    </div>
  );
}
