"use client"

import { useCallback, useEffect, useState } from 'react'
import styles from './page.module.css'
import { FaCalendar, FaSearch } from 'react-icons/fa';
import Link from 'next/link';
import { getOrganizationImage } from '@/components/LazyImage';
import booths, { Booth } from '../data/booths'
import tables, { Table } from '../data/tables'
import React from 'react';

interface BoothSectionProps {
    title: string;
    type: Booth['type'];
    collapsed: boolean;
    onToggle: () => void;
    booths: Booth[];
    selectedBooth: Booth | null;
    handleBoothSelect: (booth: Booth) => void;
  }
  
  const BoothSection: React.FC<BoothSectionProps> = ({
    title,
    type,
    collapsed,
    onToggle,
    booths,
    selectedBooth,
    handleBoothSelect
  }) => (
    <div className={styles.boothTypeSection}>
      <h3 
        className={styles.boothTypeLabel}
        onClick={onToggle}
      >
        {title}
        <span className={`${styles.collapseIcon} ${collapsed ? styles.collapsed : styles.uncollapsed}`}>
          ▼
        </span>
      </h3>
      {!collapsed && (
        <div className={styles.boothLogosContainer}>
          {booths
            .filter(booth => booth.type === type)
            .map(booth => (
              <div 
                key={booth.id} 
                className={styles.boothLogoWrapper}
                onClick={() => handleBoothSelect(booth)}
              >
                {booth.customLogo ? (
                  <img 
                    src={booth.logo} 
                    alt={booth.name}
                    className={`${styles.boothLogo} ${
                      selectedBooth?.id === booth.id ? styles.selectedBoothLogo : ''
                    }`}
                  />
                ) : (
                  getOrganizationImage(booth.name, `${styles.boothLogo} ${
                    selectedBooth?.id === booth.id ? styles.selectedBoothLogo : ''
                  }`)
                )}
                <span className={styles.boothLogoName}>{booth.name}</span>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );

export default function VenuePage() {
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null)
  const [mapPosition, setMapPosition] = useState<'middle' | 'left'>('middle')
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('')

  const boothOrder = [1, 23];
  const boothTimes: Record<number, string> = {
    1: '7:30 PM - 7:45 PM',
    23: '7:45 PM - 8:00 PM',
  };

  const filteredBooths = booths.filter(booth => {
    const searchTerms = searchQuery.toLowerCase().split(' ')
    
    // Check if any search term matches name, description, or keywords
    return searchTerms.some(term => 
      booth.name.toLowerCase().includes(term) ||
      booth.description.toLowerCase().includes(term) ||
      booth.keywords.some(keyword => keyword.toLowerCase().includes(term))
    )
  })

  // Sort results by relevance
  const sortedFilteredBooths = filteredBooths.sort((a, b) => {
    if (searchQuery.trim() === '') {
        // If search query is empty, sort alphabetically by name
        return a.name.localeCompare(b.name);
    }

    // Exact name match
    if (a.name.toLowerCase() === searchQuery.toLowerCase()) return -1
    if (b.name.toLowerCase() === searchQuery.toLowerCase()) return 1

    // Keyword match
    const aKeywordMatches = a.keywords.filter(k => 
      k.toLowerCase().includes(searchQuery.toLowerCase())
    ).length
    const bKeywordMatches = b.keywords.filter(k => 
      k.toLowerCase().includes(searchQuery.toLowerCase())
    ).length

    return bKeywordMatches - aKeywordMatches
  })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }
  
    const handleBoothSelect = (booth: Booth) => {
        if (selectedBooth?.id === booth.id) {
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
        setCollapsedSections(prev => ({
            ...prev,
            [type]: !prev[type],
        }));
    };

  const [collapsedSections, setCollapsedSections] = useState<{
    [key in Booth['type']]: boolean
  }>({
    'Committee': false,
    'SIG': false,
    'Partner': false
  })
  

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.navbarLogo}>
            <Link href="/">
                <img src="https://acm-brand-images.s3.amazonaws.com/banner-white.png" alt="ACM@UIUC" />
            </Link>
        </div>
        <div className={styles.navbarIcons}>
          <div 
            className={styles.calendarIcon} 
            onClick={() => setIsCalendarModalOpen(true)}
          >
            <FaCalendar />
          </div>
          <div 
            className={styles.searchIcon} 
            onClick={() => setIsSearchModalOpen(true)}
          >
            <FaSearch />
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      {isSearchModalOpen && (
        <div 
          className={styles.searchModalOverlay}
          onClick={() => setIsSearchModalOpen(false)}
        >
          <div 
            className={styles.searchModalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <input 
              type="text"
              placeholder="Search booths..."
              value={searchQuery}
              onChange={handleSearch}
              className={styles.searchInput}
            />
            <div className={styles.searchResults}>
              {sortedFilteredBooths.map(booth => (
                <div 
                  key={booth.id} 
                  className={styles.searchResultItem}
                  onClick={() => {
                    if (selectedBooth?.id != booth.id) {
                        handleBoothSelect(booth)
                        // Avoid accidental closing of modal 
                    }
                    setIsSearchModalOpen(false)
                  }}
                >
                  {booth.customLogo ? (
                      <img 
                        src={booth.logo} 
                        alt={booth.name}
                      />
                    ) : (
                      getOrganizationImage(booth.name)
                    )}
                  <div>
                    <h4>{booth.name}</h4>
                    <p>{booth.type}</p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              className={styles.closeSearchModal}
              onClick={() => setIsSearchModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

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
              {boothOrder.map((boothId) => {
                const booth = booths.find((b) => b.id === boothId);
                if (!booth) return null;

                return (
                  <div 
                    key={boothId} 
                    className={styles.tableItem}
                    onClick={() => {
                      if (selectedBooth?.id != booth.id) {
                        handleBoothSelect(booth);
                      }
                      setIsCalendarModalOpen(false);
                    }}
                  >
                    <div className={styles.tableIcon}>
                      <span>{booth.name}</span>
                    </div>
                    <div className={styles.tableTiming}>
                      <p>{boothTimes[boothId]}</p>
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
            <div className={`${styles.mapContainer} ${styles[`map-${mapPosition}`]}`}>
            <img 
                src="./img/open-house/CIF_map.svg" 
                alt="Venue Map" 
                className={styles.venueMap}
            />
            <div className={styles.mapOverlay}>
                {booths.map((booth) => {
                const table = tables.find((t: Table) => t.id === booth.tableId) // Find corresponding Table
                if (!table) return null
                return (
                    <div 
                    key={booth.id}
                    className={`${styles.boothMarker} ${
                        selectedBooth?.id === booth.id ? styles.selectedBoothMarker : ''
                    }`}
                    style={{
                        top: `${table.top}%`,
                        left: `${table.left}%`,
                        width: `${table.width}%`,
                        height: `${table.height}%`
                    }}
                    onClick={() => handleBoothSelect(booth)}
                    >
                      {booth.customLogo ? (
                        <img 
                          src={booth.logo} 
                          alt={booth.name}
                          className={styles.tableLogo}
                        />
                      ) : (
                        getOrganizationImage(booth.name, styles.tableLogo)
                      )}

                    </div>
                )
                })}
            </div>
        </div>

        {selectedBooth && (
            <div className={ selectedBooth ? styles.boothDetails : styles.noBoothDetails}>
                <h2>{selectedBooth.name}</h2>
                {selectedBooth.tableId === 0 ? (
                  <i>No table assigned for this booth.</i>
                ) : (
                  <p></p>
                )}
                <p>{selectedBooth.description}</p>
                
                {selectedBooth.links && (
                <div className={styles.boothLinks}>
                    {selectedBooth.links.map((link, index) => (
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
            type="Committee"
            collapsed={collapsedSections['Committee']}
            onToggle={() => toggleSection('Committee')}
            booths={booths}
            selectedBooth={selectedBooth}
            handleBoothSelect={handleBoothSelect}
        />
        <BoothSection 
            title="Special Interest Groups"
            type="SIG"
            collapsed={collapsedSections['SIG']}
            onToggle={() => toggleSection('SIG')}
            booths={booths}
            selectedBooth={selectedBooth}
            handleBoothSelect={handleBoothSelect}
        />
        <BoothSection 
            title="Partners"
            type="Partner"
            collapsed={collapsedSections['Partner']}
            onToggle={() => toggleSection('Partner')}
            booths={booths}
            selectedBooth={selectedBooth}
            handleBoothSelect={handleBoothSelect}
        />
        
      </div>
    </div>
  )
}