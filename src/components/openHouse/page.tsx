import { useEffect, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import type { OHOrgData } from './data/oh_config';
import * as tablesConfigDataRaw from './data/tables_config.json';
import * as assignmentsConfigDataRaw from './data/assignments_config.json';

interface ImageDetails {
  im_height: number;
  im_width: number;
  table_height: number;
  table_width: number;
}

interface RowConfig {
  orientation: 'vertical' | 'horizontal';
  num_tables: number;
  start_x: number;
  start_y: number;
}

interface LayoutConfig {
  image_details: ImageDetails;
  rows: Record<string, RowConfig>;
}

interface TableLayoutConfig {
  horizontal: LayoutConfig;
  vertical: LayoutConfig;
}

type AssignmentConfig = Record<string, string[]>;

const tablesConfigData = tablesConfigDataRaw as unknown as TableLayoutConfig;
const assignmentsConfigData =
  assignmentsConfigDataRaw as unknown as AssignmentConfig;

type OrgType = 'committee' | 'sig' | 'partner';

const boothSections: { title: string; type: OrgType }[] = [
  { title: 'Special Interest Groups', type: 'sig' },
  { title: 'Committees', type: 'committee' },
  { title: 'Partners', type: 'partner' },
];

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
}: BoothSectionProps) => (
  <div className="flex flex-col gap-2">
    <h3
      className="flex cursor-pointer items-center justify-between rounded-xl border border-navy-100 bg-gradient-to-br from-navy-50 to-surface-100 px-4 py-3 text-lg font-semibold text-navy-800 select-none transition-all hover:from-navy-100 hover:to-surface-150"
      onClick={onToggle}
    >
      {title}
      <span
        className={`ml-2.5 text-xs transition-transform duration-300 ${collapsed ? '-rotate-90' : ''}`}
      >
        ▼
      </span>
    </h3>
    {!collapsed && (
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-4 p-4 md:gap-2">
        {Object.keys(orgsData)
          .filter((orgId) => orgsData[orgId].type === type)
          .map((orgId) => {
            const org = orgsData[orgId];
            return (
              <div
                key={orgId}
                className="flex w-[90px] cursor-pointer flex-col items-center gap-2 md:w-[70px] md:gap-1"
                onClick={() => handleBoothSelect(orgId)}
              >
                {org.logo ? (
                  <img
                    src={org.logo}
                    alt={org.name}
                    width={90}
                    height={90}
                    className={`size-[90px] max-h-[90px] max-w-[90px] rounded-xl border-3 object-contain transition-all duration-300 hover:scale-110 md:size-[70px] md:max-h-[70px] md:max-w-[70px] ${
                      selectedBooth === orgId
                        ? 'scale-110 border-navy-500 bg-navy-50 shadow-[0_0_15px_rgba(0,119,255,0.4)]'
                        : 'border-transparent'
                    }`}
                  />
                ) : (
                  <div
                    className={`flex size-[90px] items-center justify-center rounded-xl border-3 bg-navy-50 text-center text-xs font-medium text-navy-600 transition-all duration-300 hover:scale-110 md:size-[70px] ${
                      selectedBooth === orgId
                        ? 'scale-110 border-navy-500 shadow-[0_0_15px_rgba(0,119,255,0.4)]'
                        : 'border-transparent'
                    }`}
                  >
                    {org.name}
                  </div>
                )}
                <span className="h-[30px] max-w-[90px] text-center text-sm text-navy-700 md:max-w-[70px] md:text-xs">
                  {org.name}
                </span>
              </div>
            );
          })}
      </div>
    )}
  </div>
);

interface VenuePageProps {
  orgsData: Record<string, OHOrgData>;
  mapSrc: string;
  mapVerticalSrc: string;
}

export default function VenuePage({
  orgsData,
  mapSrc,
  mapVerticalSrc,
}: VenuePageProps) {
  const [selectedBooth, setSelectedBooth] = useState<string | null>(null);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isVertical, setIsVertical] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(orientation: portrait)').matches;
    }
    return false;
  });

  const svgLayoutData = isVertical
    ? tablesConfigData.vertical
    : tablesConfigData.horizontal;

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mql = window.matchMedia('(orientation: portrait)');

    const handleOrientationChange = (
      e: MediaQueryListEvent | MediaQueryList
    ) => {
      setIsVertical(e.matches);
    };

    setIsVertical(mql.matches);

    if (mql.addEventListener) {
      mql.addEventListener('change', handleOrientationChange);
    } else if (mql.addListener) {
      mql.addListener(handleOrientationChange);
    }

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener('change', handleOrientationChange);
      } else if (mql.removeListener) {
        mql.removeListener(handleOrientationChange);
      }
    };
  }, []);

  const handleBoothSelect = (booth: string) => {
    if (selectedBooth === booth) {
      setSelectedBooth(null);
      return;
    }
    setSelectedBooth(booth);
  };

  const [collapsedSections, setCollapsedSections] = useState<
    Record<OrgType, boolean>
  >({
    committee: false,
    sig: false,
    partner: false,
  });

  const toggleSection = (type: OrgType) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleClick = (event: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const xnorm =
      ((event.clientX - box.left) / box.width) *
      svgLayoutData.image_details.im_width;
    const ynorm =
      ((event.clientY - box.top) / box.height) *
      svgLayoutData.image_details.im_height;
    let row_selected: string | null = null;
    let idx_selected = -1;

    for (const row in svgLayoutData.rows) {
      const row_info = svgLayoutData.rows[row];
      if (row_info.orientation === 'vertical') {
        if (
          xnorm >= row_info.start_x &&
          xnorm <=
            row_info.start_x + svgLayoutData.image_details.table_height &&
          ynorm >= row_info.start_y &&
          ynorm <=
            row_info.start_y +
              row_info.num_tables * svgLayoutData.image_details.table_width
        ) {
          row_selected = row;
          idx_selected = Math.floor(
            (ynorm - row_info.start_y) / svgLayoutData.image_details.table_width
          );
          break;
        }
      }
      if (row_info.orientation === 'horizontal') {
        if (
          xnorm >= row_info.start_x &&
          xnorm <=
            row_info.start_x +
              row_info.num_tables * svgLayoutData.image_details.table_width &&
          ynorm >= row_info.start_y &&
          ynorm <= row_info.start_y + svgLayoutData.image_details.table_height
        ) {
          row_selected = row;
          idx_selected = Math.floor(
            (xnorm - row_info.start_x) / svgLayoutData.image_details.table_width
          );
          break;
        }
      }
    }

    if (row_selected && assignmentsConfigData[row_selected]?.[idx_selected]) {
      setSelectedBooth(assignmentsConfigData[row_selected][idx_selected]);
    } else {
      setSelectedBooth(null);
    }
  };

  const hasDemos = Object.values(orgsData).some((org) => org.demo_time != null);

  return (
    <div className="relative w-full px-4 pt-24 md:px-8 lg:pt-32">
      {/* Calendar Modal */}
      {isCalendarModalOpen && (
        <div
          className="fixed inset-0 z-50 flex animate-[fadeIn_200ms_ease-out] items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setIsCalendarModalOpen(false)}
        >
          <div
            className="w-[90%] max-w-[600px] animate-[scaleIn_200ms_ease-out] rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-navy-900">
              Demo Room Schedule – SCCS 2405
            </h3>
            <div className="my-4 flex flex-col gap-3">
              {Object.entries(orgsData)
                .filter(([, org]) => org.demo_time != null)
                .sort(([, a], [, b]) =>
                  (a.demo_time ?? '') > (b.demo_time ?? '') ? 1 : -1
                )
                .map(([orgId, org]) => {
                  const handleTableItemClick = () => {
                    if (selectedBooth !== orgId) {
                      handleBoothSelect(orgId);
                    }
                    setIsCalendarModalOpen(false);
                  };
                  const handleTableItemKeyDown = (
                    e: JSX.TargetedKeyboardEvent<HTMLDivElement>
                  ) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleTableItemClick();
                    }
                  };
                  return (
                    <div
                      key={orgId}
                      className="flex cursor-pointer items-center justify-between rounded-xl border border-navy-100 bg-surface-050 px-4 py-3 transition-all hover:border-navy-200 hover:bg-navy-50"
                      role="button"
                      tabIndex={0}
                      onClick={handleTableItemClick}
                      onKeyDown={handleTableItemKeyDown}
                    >
                      <span className="mr-4 font-semibold text-navy-800">
                        {org.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {org.demo_time}
                      </span>
                    </div>
                  );
                })}
            </div>
            <button
              className="mt-4 w-full cursor-pointer rounded-lg bg-navy-600 py-2.5 font-medium text-white transition-colors hover:bg-navy-700"
              onClick={() => setIsCalendarModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Map */}
      <div className="relative mx-auto w-full">
        <button
          type="button"
          onClick={handleClick}
          aria-label="Interactive venue map. Click to select a booth."
          className={`block w-full cursor-pointer border-none bg-transparent p-0 transition-[filter] duration-300 ${selectedBooth ? 'blur-[3px] brightness-95' : ''}`}
        >
          <picture>
            <source srcSet={mapVerticalSrc} media="(orientation: portrait)" />
            <img
              src={mapSrc}
              className="mx-auto block w-full"
              alt="Map of event venue showing booth locations"
            />
          </picture>
        </button>

        {/* Booth Details Overlay */}
        {selectedBooth && orgsData[selectedBooth] && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            onClick={() => setSelectedBooth(null)}
          >
            <div
              className="w-[90%] max-w-[500px] animate-[scaleIn_200ms_ease-out] rounded-2xl border border-navy-100 bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <h2 className="text-2xl font-bold text-navy-900">
                  {orgsData[selectedBooth].name}
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
                {orgsData[selectedBooth].description}
              </p>

              {orgsData[selectedBooth].links &&
                orgsData[selectedBooth].links.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {orgsData[selectedBooth].links.map(
                      (link, index: number) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg bg-navy-600 px-4 py-2 text-sm font-medium text-white no-underline transition-colors hover:bg-navy-700"
                        >
                          {link.text}
                        </a>
                      )
                    )}
                  </div>
                )}
            </div>
          </div>
        )}
      </div>

      {/* Booth Type Sections */}
      <div className="mx-auto flex w-[90%] max-w-7xl flex-col gap-3 px-4 pt-4 pb-8">
        {hasDemos && (
          <button
            type="button"
            className="self-center rounded-lg border border-navy-200 bg-navy-50 px-5 py-2 text-sm font-semibold text-navy-700 transition-colors hover:bg-navy-100"
            onClick={() => setIsCalendarModalOpen(true)}
          >
            View Demo Schedule
          </button>
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
