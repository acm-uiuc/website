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
import * as svgLayoutData from '../data/tables_config.json';
import * as orgsConfigData from '../data/orgs_config.json';
import * as assignmentsConfigData from '../data/assignments_config.json';

/* 
* This has been hacked together twice. This hacking together is at least a bit more modular, 
* but it needs to be partially redone. Most importantly, there's a lot of typing hacks that assume 
* a guarantee that the json is properly configured. -JL
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
        {Object.keys(orgsConfigData).filter((orgId => (orgsConfigData as any)[orgId].type === type))
          .map((orgId) => (
            <div
              key={orgId}
              className={styles.boothLogoWrapper}
              onClick={() => handleBoothSelect(orgId)}
            >
              {(orgsConfigData as any)[orgId].logo ? (
                <img
                  src={(orgsConfigData as any)[orgId].logo}
                  alt={(orgsConfigData as any)[orgId].name}
                  className={`${styles.boothLogo} ${
                    selectedBooth === orgId
                      ? styles.selectedBoothLogo
                      : ''
                  }`}
                />
              ) : ""}
              <span className={styles.boothLogoName}>{(orgsConfigData as any)[orgId].name}</span>
            </div>
          ))}
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
    const xnorm = (event.clientX - box.left) / box.width * svgLayoutData.image_details.im_width;
    const ynorm = (event.clientY - box.top) / box.height * svgLayoutData.image_details.im_height;
    let row_selected = null;
    let idx_selected = -1;

    for (const row in svgLayoutData.rows) {
      const row_info = (svgLayoutData as any).rows[row];
      if (row_info.orientation == "vertical"){
        if (xnorm >= row_info.start_x && xnorm <= row_info.start_x + svgLayoutData.image_details.table_height && ynorm >= row_info.start_y && ynorm <= row_info.start_y + row_info.num_tables * svgLayoutData.image_details.table_width){
          row_selected = row;
          idx_selected = Math.floor((ynorm - row_info.start_y) / svgLayoutData.image_details.table_width);
          break;
        }
      }
      if (row_info.orientation == "horizontal"){
        if (xnorm >= row_info.start_x && xnorm <= row_info.start_x + row_info.num_tables * svgLayoutData.image_details.table_width && ynorm >= row_info.start_y && ynorm <= row_info.start_y + svgLayoutData.image_details.table_height){
          row_selected = row;
          idx_selected = Math.floor((xnorm - row_info.start_x) / svgLayoutData.image_details.table_width);
          break;
        }
      }
    }

    if (row_selected && (assignmentsConfigData as any)[row_selected][idx_selected]){
      setSelectedBooth((assignmentsConfigData as any)[row_selected][idx_selected]);
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
            <h3>Demo Room Schedule – CIF 0018</h3>
            <div className={styles.tableList}>
              {Object.keys(orgsConfigData).map((orgId) => {
               return [orgId, (orgsConfigData as any)[orgId].name,  (orgsConfigData as any)[orgId].demo_time]
              }).filter(x => x[2] != null).sort(x => x[2]).map((data) => {
                return (
                  <div
                    key={data[0]}
                    className={styles.tableItem}
                    onClick={() => {
                      if (selectedBooth != data[0]) {
                        handleBoothSelect(data[0]);
                      }
                      setIsCalendarModalOpen(false);
                    }}
                  >
                    <div className={styles.tableIcon}>
                      <span>{data[1]}</span>
                    </div>
                    <div className={styles.tableTiming}>
                      <p>{data[2]}</p>
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
        <div ><img src='/oh_map.svg' id="svg" alt="map of event" style={{ cursor: "pointer", width: "100%" }} onClick={handleClick}/></div>

        {selectedBooth && (
          <div
            className={
              selectedBooth ? styles.boothDetails : styles.noBoothDetails
            }
          >
            <h2>{(orgsConfigData as any)[selectedBooth].name}</h2>
            <p></p>
            <p>{(orgsConfigData as any)[selectedBooth].description}</p>

            {(orgsConfigData as any)[selectedBooth].links && (
              <div className={styles.boothLinks}>
                {(orgsConfigData as any)[selectedBooth].links.map((link:any, index:any) => (
                  <a
                    key={index}
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginRight: '10px' }}
                  >
                    {link.text}
                  </a>
                ))}
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
