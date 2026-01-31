'use client';

import { useCallback, useEffect, useState } from 'react';
import styles from './page.module.css';
import { FaCalendar, FaSearch } from 'react-icons/fa';
import Link from 'next/link';
import { getOrganizationImage } from '@/components/LazyImage';
import booths, { Booth } from '../data/booths';
import tables, { Table } from '../data/tables';
import React from 'react';
import CanvasMap from './CanvasMap';
import * as tablesConfigDataRaw from '../data/tables_config.json';
import * as orgsConfigDataRaw from '../data/orgs_config.json';
import * as assignmentsConfigDataRaw from '../data/assignments_config.json';

// TypeScript interfaces for JSON config files
interface OrgLink {
  text: string;
  link: string;
}

interface OrgConfig {
  name: string;
  description: string;
  type: 'committee' | 'sig' | 'partner';
  logo?: string;
  demo_time?: string | null;
  links?: OrgLink[];
}

type OrgsConfigData = Record<string, OrgConfig>;

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

// Type the imported JSON data
const orgsConfigData = orgsConfigDataRaw as unknown as OrgsConfigData;
const tablesConfigData = tablesConfigDataRaw as unknown as TableLayoutConfig;
const assignmentsConfigData =
  assignmentsConfigDataRaw as unknown as AssignmentConfig;

/*
 * This has been hacked together twice. This hacking together is at least a bit more modular,
 * but it needs to be partially redone. -JL
 */

interface BoothSectionProps {
  title: string;
  type: Booth['type'];
  collapsed: boolean;
  onToggle: () => void;
  selectedBooth: string | null;
  handleBoothSelect: (booth: string) => void;
}

const BoothSection: React.FC<BoothSectionProps> = ({
  title,
  type,
  collapsed,
  onToggle,
  selectedBooth,
  handleBoothSelect,
}) => (
  <div className={styles.boothTypeSection}>
    <h3 className={styles.boothTypeLabel} onClick={onToggle}>
      {title}
      <span
        className={`${styles.collapseIcon} ${collapsed ? styles.collapsed : styles.uncollapsed}`}
      >
        ▼
      </span>
    </h3>
    {!collapsed && (
      <div className={styles.boothLogosContainer}>
        {Object.keys(orgsConfigData)
          .filter((orgId) => orgsConfigData[orgId].type === type)
          .map((orgId) => {
            const org = orgsConfigData[orgId];
            return (
              <div
                key={orgId}
                className={styles.boothLogoWrapper}
                onClick={() => handleBoothSelect(orgId)}
              >
                {org.logo ? (
                  <img
                    src={org.logo}
                    alt={org.name}
                    className={`${styles.boothLogo} ${
                      selectedBooth === orgId ? styles.selectedBoothLogo : ''
                    }`}
                  />
                ) : (
                  ''
                )}
                <span className={styles.boothLogoName}>{org.name}</span>
              </div>
            );
          })}
      </div>
    )}
  </div>
);

export default function VenuePage() {
  const [selectedBooth, setSelectedBooth] = useState<string | null>(null);
  const [mapPosition, setMapPosition] = useState<'middle' | 'left'>('middle');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVertical, setIsVertical] = useState(() => {
    // Initialize with media query value for SSR-safe initial render
    if (typeof window !== 'undefined') {
      return window.matchMedia('(orientation: portrait)').matches;
    }
    return false;
  });

  // Select config based on viewport orientation
  const svgLayoutData = isVertical
    ? tablesConfigData.vertical
    : tablesConfigData.horizontal;

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mql = window.matchMedia('(orientation: portrait)');

    const handleOrientationChange = (
      e: MediaQueryListEvent | MediaQueryList,
    ) => {
      setIsVertical(e.matches);
    };

    // Set initial value in case SSR rendered differently
    setIsVertical(mql.matches);

    // Use addEventListener if available, fallback to addListener for older browsers
    if (mql.addEventListener) {
      mql.addEventListener('change', handleOrientationChange);
    } else if (mql.addListener) {
      // Deprecated but needed for older Safari
      mql.addListener(handleOrientationChange);
    }

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener('change', handleOrientationChange);
      } else if (mql.removeListener) {
        // Deprecated but needed for older Safari
        mql.removeListener(handleOrientationChange);
      }
    };
  }, []);

  const boothOrder = [1, 23];
  const boothTimes: Record<number, string> = {
    1: '7:30 PM - 7:45 PM',
    23: '7:45 PM - 8:00 PM',
  };

  const filteredBooths = booths.filter((booth) => {
    const searchTerms = searchQuery.toLowerCase().split(' ');

    // Check if any search term matches name, description, or keywords
    return searchTerms.some(
      (term) =>
        booth.name.toLowerCase().includes(term) ||
        booth.description.toLowerCase().includes(term) ||
        booth.keywords.some((keyword) => keyword.toLowerCase().includes(term)),
    );
  });

  // Sort results by relevance
  const sortedFilteredBooths = filteredBooths.sort((a, b) => {
    if (searchQuery.trim() === '') {
      // If search query is empty, sort alphabetically by name
      return a.name.localeCompare(b.name);
    }

    // Exact name match
    if (a.name.toLowerCase() === searchQuery.toLowerCase()) return -1;
    if (b.name.toLowerCase() === searchQuery.toLowerCase()) return 1;

    // Keyword match
    const aKeywordMatches = a.keywords.filter((k) =>
      k.toLowerCase().includes(searchQuery.toLowerCase()),
    ).length;
    const bKeywordMatches = b.keywords.filter((k) =>
      k.toLowerCase().includes(searchQuery.toLowerCase()),
    ).length;

    return bKeywordMatches - aKeywordMatches;
  });

  const handleBoothSelect = (booth: string) => {
    if (selectedBooth === booth) {
      setSelectedBooth(null);
      setMapPosition('middle');
      return;
    }
    setSelectedBooth(booth);
    setMapPosition('left');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const toggleSection = (type: Booth['type']) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const [collapsedSections, setCollapsedSections] = useState<{
    [key in Booth['type']]: boolean;
  }>({
    Committee: false,
    SIG: false,
    Partner: false,
  });

  const handleClick = (event: React.MouseEvent) => {
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
            (ynorm - row_info.start_y) /
              svgLayoutData.image_details.table_width,
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
            (xnorm - row_info.start_x) /
              svgLayoutData.image_details.table_width,
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

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.navbarLogo}>
          <Link href="/">
            <img
              src="https://static.acm.illinois.edu/banner-white.png"
              alt="ACM@UIUC"
            />
          </Link>
        </div>
        <div className={styles.navbarIcons}>
          <div
            className={styles.calendarIcon}
            onClick={() => setIsCalendarModalOpen(true)}
          >
            <FaCalendar />
            Schedule
          </div>
        </div>
      </nav>

      {isCalendarModalOpen && (
        <div
          className={styles.calendarModalOverlay}
          onClick={() => setIsCalendarModalOpen(false)}
        >
          <div
            className={styles.calendarModalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Demo Room Schedule – SCCS 2405</h3>
            <div className={styles.tableList}>
              {Object.keys(orgsConfigData)
                .map((orgId) => {
                  const org = orgsConfigData[orgId];
                  return {
                    id: orgId,
                    name: org.name,
                    demoTime: org.demo_time,
                  };
                })
                .filter((x) => x.demoTime != null)
                .sort((a, b) =>
                  (a.demoTime ?? '') > (b.demoTime ?? '') ? 1 : -1,
                )
                .map((data) => {
                  const handleTableItemClick = () => {
                    if (selectedBooth !== data.id) {
                      handleBoothSelect(data.id);
                    }
                    setIsCalendarModalOpen(false);
                  };
                  const handleTableItemKeyDown = (
                    e: React.KeyboardEvent<HTMLDivElement>,
                  ) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleTableItemClick();
                    }
                  };
                  return (
                    <div
                      key={data.id}
                      className={styles.tableItem}
                      role="button"
                      tabIndex={0}
                      onClick={handleTableItemClick}
                      onKeyDown={handleTableItemKeyDown}
                    >
                      <div className={styles.tableIcon}>
                        <span>{data.name}</span>
                      </div>
                      <div className={styles.tableTiming}>
                        <p>{data.demoTime}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
            <button
              className={styles.closeCalendarModal}
              onClick={() => setIsCalendarModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className={styles.mapAndDetailsContainer}>
        <div>
          <button  
            type="button"  
            onClick={handleClick}  
            aria-label="Interactive venue map. Click to select a booth."  
            style={{  
              background: 'none',  
              border: 'none',  
              padding: 0,  
              cursor: 'pointer',  
              width: '100%',  
              display: 'block',  
            }}  
          >  
            <picture>
              <source srcSet="/oh_map_vertical.svg" media="(orientation: portrait)" />
              <img
                src="/oh_map.svg"
                className={styles.mapImage}
                alt="Map of event venue showing booth locations"
              />
            </picture>
          </button>
        </div>

        {selectedBooth && orgsConfigData[selectedBooth] && (
          <div
            className={
              selectedBooth ? styles.boothDetails : styles.noBoothDetails
            }
          >
            <h2>{orgsConfigData[selectedBooth].name}</h2>
            <p></p>
            <p>{orgsConfigData[selectedBooth].description}</p>

            {orgsConfigData[selectedBooth].links && (
              <div className={styles.boothLinks}>
                {orgsConfigData[selectedBooth].links.map(
                  (link: OrgLink, index: number) => (
                    <a
                      key={index}
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginRight: '10px' }}
                    >
                      {link.text}
                    </a>
                  ),
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className={styles.boothTypesContainer}>
        {/* Committees Section */}
        <BoothSection
          title="Committees"
          type="committee"
          collapsed={collapsedSections['Committee']}
          onToggle={() => toggleSection('Committee')}
          selectedBooth={selectedBooth}
          handleBoothSelect={handleBoothSelect}
        />
        <BoothSection
          title="Special Interest Groups"
          type="sig"
          collapsed={collapsedSections['SIG']}
          onToggle={() => toggleSection('SIG')}
          selectedBooth={selectedBooth}
          handleBoothSelect={handleBoothSelect}
        />
        <BoothSection
          title="Partners"
          type="partner"
          collapsed={collapsedSections['Partner']}
          onToggle={() => toggleSection('Partner')}
          selectedBooth={selectedBooth}
          handleBoothSelect={handleBoothSelect}
        />
      </div>
    </div>
  );
}
