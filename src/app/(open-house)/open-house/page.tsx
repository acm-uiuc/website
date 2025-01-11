"use client"

// page.tsx
import { useState } from 'react'
import styles from './page.module.css'
// import './globals.css';

interface Table {
  id: number
  top: number
  left: number
  width: number
  height: number
}

interface Booth {
  id: string
  type: 'Committee' | 'SIG' | 'Partner'
  name: string
  logo: string
  description: string
  links?: {
    website?: string
    social?: string
  }
  keywords: string[]
  tableId: number
}

const tables: Table[] = [
  {
    id: 1,
    top: 82,
    left: 65,
    width: 10,
    height: 6
  },
  {
    id: 2,
    top: 82,
    left: 55,
    width: 10,
    height: 6
  },
  {
    id: 3,
    top: 82,
    left: 45,
    width: 10,
    height: 6
  },
  {
    id: 4,
    top: 82,  
    left: 35,  
    width: 10,
    height: 6
  },
  {
    id: 5,
    top: 82,  
    left: 25,  
    width: 10,
    height: 6
  },
  {
    id: 6,
    top: 82,
    left: 15,
    width: 10,
    height: 6
  },
  {
    id: 7,
    top: 64,
    left: 60.5,
    width: 10,
    height: 6
  },
  {
    id: 8,
    top: 64,
    left: 50.5,
    width: 10,
    height: 6
  },
  {
    id: 9,
    top: 64,
    left: 40.5,
    width: 10,
    height: 6
  },
  {
    id: 10,
    top: 64,
    left: 30.5,
    width: 10,
    height: 6
  },
  {
    id: 11,
    top: 70,
    left: 8,
    width: 5,
    height: 12
  },
  {
    id: 12,
    top: 57,
    left: 25,
    width: 5,
    height: 13
  },
  {
    id: 13,
    top: 57,  
    left: 8,  
    width: 5,
    height: 12 
  },
  {
    id: 14,
    top: 44,
    left: 25,
    width: 5,
    height: 13
  },
  {
    id: 15,
    top: 44,
    left: 8,
    width: 5,
    height: 12
  },
  {
    id: 16,
    top: 30,
    left: 25,
    width: 5,
    height: 14
  },
  {
    id: 17,
    top: 31,  
    left: 8,  
    width: 5,
    height: 12 
  },
  {
    id: 18,
    top: 18,  
    left: 8,  
    width: 5,
    height: 12 
  },
  {
    id: 19,
    top: 10,  
    left: 15,  
    width: 10,
    height: 6
  },
  {
    id: 20,
    top: 10,
    left: 25,
    width: 10,
    height: 6
  },
  {
    id: 21,
    top: 10,
    left: 35,
    width: 10,
    height: 6
  },
  {
    id: 22,
    top: 10,
    left: 45,
    width: 10,
    height: 6
  },
  {
    id: 23,
    top: 10,
    left: 55,
    width: 10,
    height: 6
  },
  {
    id: 24,
    top: 10,  
    left: 65, 
    width: 10,
    height: 6
  },
  {
    id: 25,
    top: 10,  
    left: 75,  
    width: 10,
    height: 6 
  },
  {
    id: 26,
    top: 30,
    left: 30.5,
    width: 10,
    height: 6
  },
  {
    id: 27,
    top: 30,
    left: 40.5,
    width: 10,
    height: 6
  },
  {
    id: 28,
    top: 30,
    left: 50.5,
    width: 10,
    height: 6
  },
  {
    id: 29,
    top: 30,
    left: 60.5,
    width: 10,
    height: 6
  },
  {
    id: 30,
    top: 18,  
    left: 87,  
    width: 5,
    height: 12 
  },
  {
    id: 31,
    top: 31,  
    left: 87,  
    width: 5,
    height: 12
  },
  {
    id: 32,
    top: 44,  
    left: 87,  
    width: 5,
    height: 12 
  },
  {
    id: 33,
    top: 57,  
    left: 87,  
    width: 5,
    height: 12 
  },
  {
    id: 34,
    top: 30,
    left: 71,
    width: 5,
    height: 14
  },
  {
    id: 35,
    top: 44,
    left: 71,
    width: 5,
    height: 13
  },
  {
    id: 36,
    top: 57,
    left: 71,
    width: 5,
    height: 13
  }
    

];

const booths: Booth[] = [
  {
    id: '1',
    type: 'Committee',
    name: 'ACM Infrastructure',
    logo: 'https://www.acm.illinois.edu/_next/static/media/infra-logo.0875ef93.png',
    description: 'The infra team maintains ACM@UIUC\'s infrastructure and engineering efforts, like the websites and APIs that power the cool things ACM does.',
    tableId: 1,
    keywords: ['tech', 'infrastructure', 'engineering'],
    links: {
      website: 'https://techinnovators.com',
      social: 'https://twitter.com/techinnovators'
    }
  }, 
  {
    id: '2',
    type: 'Committee',
    name: 'ACM Marketing',
    logo: 'https://www.acm.illinois.edu/_next/static/media/marketing-logo.01253402.png',
    description: 'The marketing team is responsible for promoting ACM@UIUC\'s events and initiatives, ensuring that our community stays informed and engaged.',
    tableId: 2,
    keywords: ['marketing', 'promotion', 'community'],
    links: {
      website: 'https://marketing.com',
      social: 'https://facebook.com/marketing'
    }
  },
  {
    id: '3',
    type: 'Committee',
    name: 'ACM Social',
    logo: 'https://www.acm.illinois.edu/_next/static/media/social-logo.a9f147d9.png',
    description: 'The infra team maintains ACM@UIUC\'s infrastructure and engineering efforts, like the websites and APIs that power the cool things ACM does.',
    tableId: 3,
    keywords: ['social', 'community', 'engagement'],
    links: {
      website: 'https://techinnovators.com',
      social: 'https://twitter.com/techinnovators'
    }
  }, 
  {
    id: '4',
    type: 'Committee',
    name: 'ACM Corporate',
    logo: 'https://www.acm.illinois.edu/_next/static/media/corporate-logo.6f9bcd38.png',
    description: 'The marketing team is responsible for promoting ACM@UIUC\'s events and initiatives, ensuring that our community stays informed and engaged.',
    tableId: 4,
    keywords: ['corporate', 'business', 'partnership'],
    links: {
      website: 'https://marketing.com',
      social: 'https://facebook.com/marketing'
    }
  },
  {
    id: '5',
    type: 'Committee',
    name: 'ACM Mentorship',
    logo: 'https://www.acm.illinois.edu/_next/static/media/mentorship-logo.99b594ec.png',
    description: 'The infra team maintains ACM@UIUC\'s infrastructure and engineering efforts, like the websites and APIs that power the cool things ACM does.',
    tableId: 5,
    keywords: ['mentorship', 'guidance', 'support'],
    links: {
      website: 'https://techinnovators.com',
      social: 'https://twitter.com/techinnovators'
    }
  }, 
  {
    id: '6',
    type: 'Committee',
    name: 'ACM Academic',
    logo: 'https://www.acm.illinois.edu/_next/static/media/accom-logo.c07f6d43.png',
    description: 'The marketing team is responsible for promoting ACM@UIUC\'s events and initiatives, ensuring that our community stays informed and engaged.',
    tableId: 6,
    keywords: ['academic', 'research', 'education'],
    links: {
      website: 'https://marketing.com',
      social: 'https://facebook.com/marketing'
    }
  },
  {
    id: '7',
    type: 'Committee',
    name: 'HackIllinois',
    logo: 'https://avatars.githubusercontent.com/u/5751098?v=4',
    description: 'The infra team maintains ACM@UIUC\'s infrastructure and engineering efforts, like the websites and APIs that power the cool things ACM does.',
    tableId: 7,
    keywords: ['hackathon', 'registration', 'technology'],
    links: {
      website: 'https://techinnovators.com',
      social: 'https://twitter.com/techinnovators'
    }
  }, 
  {
    id: '8',
    type: 'Committee',
    name: 'RP',
    logo: 'https://www.acm.illinois.edu/_next/static/media/reflections.1d1f81a9.jpg',
    description: 'The marketing team is responsible for promoting ACM@UIUC\'s events and initiatives, ensuring that our community stays informed and engaged.',
    tableId: 8,
    keywords: ['RP', 'conference', 'technology'],
    links: {
      website: 'https://marketing.com',
      social: 'https://facebook.com/marketing'
    }
  },
  {
    id: '9',
    type: 'SIG',
    name: 'SIGGRAPH',
    logo: 'https://www.acm.illinois.edu/_next/static/media/siggraphlogo.8d649104.png',
    description: 'SIGGRAPH focuses on computer graphics and interactive techniques.',
    tableId: 9,
    keywords: ['graphics', 'interactive', 'technology'],
    links: {
      website: 'https://siggraph.org',
      social: 'https://twitter.com/siggraph'
    }
  },
  {
    id: '10',
    type: 'SIG',
    name: 'SIGCHI',
    logo: 'https://www.acm.illinois.edu/_next/static/media/sigchilogo.0906829c.png',
    description: 'SIGCHI is the premier international society for professionals, academics and students who are interested in human-technology and human-computer interaction (HCI).',
    tableId: 10,
    keywords: ['HCI', 'interaction', 'technology'],
    links: {
      website: 'https://sigchi.org',
      social: 'https://twitter.com/sigchi'
    }
  },
  {
    id: '11',
    type: 'SIG',
    name: 'ICPC',
    logo: 'https://www.acm.illinois.edu/_next/static/media/icpclogo.9cf3e9a0.png',
    description: 'SIGCOMM is ACM\'s professional forum for discussing communications and computer networks.',
    tableId: 11,
    keywords: ['ICPC', 'programming', 'competition'],
    links: {
      website: 'https://sigcomm.org',
      social: 'https://twitter.com/sigcomm'
    }
  },
  {
    id: '12',
    type: 'SIG',
    name: 'GameBuilders',
    logo: 'https://www.acm.illinois.edu/_next/static/media/gamebuildlogo.be8b0760.png',
    description: 'GameBuilders is a SIG focused on game development and design.',
    tableId: 12,
    keywords: ['game', 'development', 'design'],
    links: {
      website: 'https://gamebuilders.org',
      social: 'https://twitter.com/gamebuilders'
    }
  },
  {
    id: '13',
    type: 'SIG',
    name: 'SIGPwny',
    logo: 'https://www.acm.illinois.edu/_next/static/media/sigpwnylogo.b330e5e5.png',
    description: 'SIGPwny is a SIG focused on cybersecurity and ethical hacking.',
    tableId: 13,
    keywords: ['cybersecurity', 'hacking', 'technology'],
    links: {
      website: 'https://sigpwny.org',
      social: 'https://twitter.com/sigpwny'
    }
  },
  {
    id: '14',
    type: 'SIG',
    name: 'SIGAIDA',
    logo: 'https://www.acm.illinois.edu/_next/static/media/sigaidalogo.03c8bdcb.png',
    description: 'SIGAIDA is a SIG focused on artificial intelligence and data analytics.',
    tableId: 14,
    keywords: ['AI', 'data', 'analytics'],
    links: {
      website: 'https://sigaida.org',
      social: 'https://twitter.com/sigaida'
    }
  },
  {
    id: '15',
    type: 'SIG',
    name: 'SIGMobile',
    logo: 'https://www.acm.illinois.edu/_next/static/media/sigmobilelogo.efa06402.png',
    description: 'SIGMobile is a SIG focused on mobile computing and wireless networking.',
    tableId: 15,
    keywords: ['mobile', 'computing', 'wireless'],
    links: {
      website: 'https://sigmobile.org',
      social: 'https://twitter.com/sigmobile'
    }
  },
  {
    id: '16',
    type: 'SIG',
    name: 'SIGMusic',
    logo: 'https://www.acm.illinois.edu/_next/static/media/sigmusiclogo.11931c18.png',
    description: 'SIGMusic is a SIG focused on music technology and digital audio.',
    tableId: 16,
    keywords: ['music', 'technology', 'audio'],
    links: {
      website: 'https://sigmusic.org',
      social: 'https://twitter.com/sigmusic'
    }
  },
  {
    id: '17',
    type: 'Partner',
    name: 'Tech Innovators',
    logo: 'https://techinnovators.com/logo.png',
    description: 'Tech Innovators is a leading tech company specializing in innovative solutions.',
    tableId: 17,
    keywords: ['tech', 'innovation', 'solutions'],
    links: {
      website: 'https://techinnovators.com',
      social: 'https://twitter.com/techinnovators'
    }
  },
  {
    id: '18',
    type: 'Partner',
    name: 'Innovate Tech',
    logo: 'https://innovate-tech.com/logo.png',
    description: 'Innovate Tech is a leading tech company specializing in innovative solutions.',
    tableId: 18,
    keywords: ['tech', 'innovation', 'solutions'],
    links: {
      website: 'https://innovatetech.com',
      social: 'https://linkedin.com/company/innovatetech'
    }
  }, 
  {
    id: '19',
    type: 'Partner',
    name: 'Tech Solutions',
    logo: 'https://techsolutions.com/logo.png',
    description: 'Tech Solutions is a leading tech company specializing in innovative solutions.',
    tableId: 19,
    keywords: ['tech', 'innovation', 'solutions'],
    links: {
      website: 'https://techsolutions.com',
      social: 'https://linkedin.com/company/techsolutions'
    }
  },
  {
    id: '20',
    type: 'Partner',
    name: 'Innovate Solutions',
    logo: 'https://innovatesolutions.com/logo.png',
    description: 'Innovate Solutions is a leading tech company specializing in innovative solutions.',
    tableId: 20,
    keywords: ['tech', 'innovation', 'solutions'],
    links: {
      website: 'https://innovatesolutions.com',
      social: 'https://linkedin.com/company/innovatesolutions'
    }
  },
  { 
    id: '21',
    type: 'Partner',
    name: 'Tech Innovations',
    logo: 'https://techinnovations.com/logo.png',
    description: 'Tech Innovations is a leading tech company specializing in innovative solutions.',
    tableId: 21,
    keywords: ['tech', 'innovation', 'solutions'],
    links: {
      website: 'https://techinnovations.com',
      social: 'https://linkedin.com/company/techinnovations'
    }
  },
  {
    id: '22',
    type: 'Partner',
    name: 'Innovate Tech Solutions',
    logo: 'https://innovate-tech-solutions.com/logo.png',
    description: 'Innovate Tech Solutions is a leading tech company specializing in innovative solutions.',
    tableId: 22,
    keywords: ['tech', 'innovation', 'solutions'],
    links: {
      website: 'https://innovatetechsolutions.com',
      social: 'https://linkedin.com/company/innovatetechsolutions'
    }
  },
  {
    id: '23',
    type: 'Partner',
    name: 'Tech Innovators Inc.',
    logo: 'https://techinnovatorsinc.com/logo.png',
    description: 'Tech Innovators Inc. is a leading tech company specializing in innovative solutions.',
    tableId: 23,
    keywords: ['tech', 'innovation', 'solutions'],
    links: {
      website: 'https://techinnovatorsinc.com',
      social: 'https://linkedin.com/company/techinnovatorsinc'
    }
  }, 
  {
    id: '24',
    type: 'Partner',
    name: 'Tech Solutions Inc C.',
    logo: 'https://techsolutionsinc.com/logo.png',
    description: 'Tech Solutions Inc. is a leading tech company specializing in innovative solutions.',
    tableId: 24,
    keywords: ['tech', 'innovation', 'solutions'],
    links: {
      website: 'https://techsolutionsinc.com',
      social: 'https://linkedin.com/company/techsolutionsinc'
    }
  }, 
  {
    id: '25',
    type: 'Partner',
    name: 'Innovate Tech Inc.',
    logo: 'https://innovate-tech-inc.com/logo.png',
    description: 'Innovate Tech Inc. is a leading tech company specializing in innovative solutions.',
    tableId: 25,
    keywords: ['tech', 'innovation', 'solutions'],
    links: {
      website: 'https://innovatetechinc.com',
      social: 'https://linkedin.com/company/innovatetechinc'
    }
  },
  {
    id: '26',
    type: 'Partner',
    name: 'Tech Innovations Inc.',
    logo: 'https://techinnovationsinc.com/logo.png',
    description: 'Tech Innovations Inc. is a leading tech company specializing in innovative solutions.',
    tableId: 26,
    keywords: ['tech', 'innovation', 'solutions'],
    links: {
        website: 'https://techinnovationsinc.com',
        social: 'https://linkedin.com/company/techinnovationsinc'
    }
  },
  {
    id: '27',
    type: 'Partner',
    name: 'Tech Solutions Inc B.',
    logo: 'https://techsolutionsinc.com/logo.png',
    description: 'Tech Solutions Inc. is a leading tech company specializing in innovative solutions.',
    tableId: 27,
    keywords: ['tech', 'innovation', 'solutions'],
    links: {
        website: 'https://techsolutionsinc.com',
        social: 'https://linkedin.com/company/techsolutionsinc'
    }
  },
  {
    id: '28',
    type: 'Partner',
    name: 'Innovate Solutions Inc.',
    logo: 'https://innovatesolutionsinc.com/logo.png',
    description: 'Innovate Solutions Inc. is a leading tech company specializing in innovative solutions.',
    tableId: 28,
    keywords: ['tech', 'innovation', 'solutions'],
    links: {
        website: 'https://innovatesolutionsinc.com',
        social: 'https://linkedin.com/company/innovatesolutionsinc'
    }
  },
  {
    id: '29',
    type: 'Partner',
    name: 'Tech Innovations Inc.',
    logo: 'https://techinnovationsinc.com/logo.png',
    description: 'Tech Innovations Inc. is a leading tech company specializing in innovative solutions.',
    tableId: 29,
    keywords: ['tech', 'innovation', 'solutions'],
    links: {
        website: 'https://techinnovationsinc.com',
        social: 'https://linkedin.com/company/techinnovationsinc'
    }
  },
  {
    id: '30',
    type: 'Partner',
    name: 'Tech Solutions Inc A.',
    logo: 'https://techsolutionsinc.com/logo.png',
    description: 'Tech Solutions Inc. is a leading tech company specializing in innovative solutions.',
    tableId: 30,
    keywords: ['tech', 'innovation', 'solutions'],
    links: {
        website: 'https://techsolutionsinc.com',
        social: 'https://linkedin.com/company/techsolutionsinc'
    }
  },
  {
    id: '31',
    type: 'Partner',
    name: 'Innovate Tech Inc.',
    logo: 'https://innovate-tech-inc.com/logo.png',
    description: 'Innovate Tech Inc. is a leading tech company specializing in innovative solutions.',
    tableId: 31,
    keywords: ['tech', 'innovation', 'solutions'],
    links: {
        website: 'https://innovatetechinc.com',
        social: 'https://linkedin.com/company/innovatetechinc'
    }
  },
  {
    id: '32',
    type: 'Partner',
    name: 'Tech Solutions Inc E.',
    logo: 'https://techsolutionsinc.com/logo.png',
    description: 'Tech Solutions Inc. is a leading tech company specializing in innovative solutions.',
    tableId: 32,
    keywords: ['tech', 'innovation', 'solutions'],
    links: {
        website: 'https://techsolutionsinc.com',
        social: 'https://linkedin.com/company/techsolutionsinc'
    }
  },
  {
    id: '33',
    type: 'Partner',
    name: 'Tech Innovations Inc.',
    logo: 'https://techinnovationsinc.com/logo.png',
    description: 'Tech Innovations Inc. is a leading tech company specializing in innovative solutions.',
    tableId: 33,
    keywords: ['tech', 'innovation', 'solutions'],
    links: {
        website: 'https://techinnovationsinc.com',
        social: 'https://linkedin.com/company/techinnovationsinc'
    }
  },
  {
    id: '34',
    type: 'Partner',
    name: 'Tech Solutions Inc D.',
    logo: 'https://techsolutionsinc.com/logo.png',
    description: 'Tech Solutions Inc. is a leading tech company specializing in innovative solutions.',
    tableId: 34,
    keywords: ['tech', 'innovation', 'solutions'],
    links: {
        website: 'https://techsolutionsinc.com',
        social: 'https://linkedin.com/company/techsolutionsinc'
    }
  },
  {
    id: '35',
    type: 'Partner',
    name: 'Innovate Tech Inc.',
    logo: 'https://innovate-tech-inc.com/logo.png',
    description: 'Innovate Tech Inc. is a leading tech company specializing in innovative solutions.',
    tableId: 35,
    keywords: ['tech', 'innovation', 'solutions'],
    links: {
        website: 'https://innovatetechinc.com',
        social: 'https://linkedin.com/company/innovatetechinc'
    }
  },
  {
    id: '36',
    type: 'Partner',
    name: 'Tech Innovations Inc.',
    logo: 'https://techinnovationsinc.com/logo.png',
    description: 'Tech Innovations Inc. is a leading tech company specializing in innovative solutions.',
    tableId: 36,
    keywords: ['tech', 'innovation', 'solutions'],
    links: {
        website: 'https://techinnovationsinc.com',
        social: 'https://linkedin.com/company/techinnovationsinc'
    }
  }
  
  // More booths...
]

export default function VenuePage() {
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null)
  const [mapPosition, setMapPosition] = useState<'middle' | 'left'>('middle')
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

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

  const [collapsedSections, setCollapsedSections] = useState<{
    [key in Booth['type']]: boolean
  }>({
    'Committee': false,
    'SIG': false,
    'Partner': false
  })

  const toggleSection = (type: Booth['type']) => {
    setCollapsedSections(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  const handleBoothSelect = (booth: Booth) => {
    if (selectedBooth?.id === booth.id) {
      setSelectedBooth(null)
      setMapPosition('middle')
      return
    }
    setSelectedBooth(booth)
    setMapPosition('left')

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.navbarLogo}>
          <img src="https://acm-brand-images.s3.amazonaws.com/banner-white.png" alt="Event Logo" />
        </div>
        <div 
          className={styles.searchIcon}
          onClick={() => setIsSearchModalOpen(true)}
        >
          🔍
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
                    handleBoothSelect(booth)
                    setIsSearchModalOpen(false)
                  }}
                >
                  <img src={booth.logo} alt={booth.name} />
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

      <div className={styles.mapAndDetailsContainer}>
        <div className={`${styles.mapContainer} ${styles[`map-${mapPosition}`]}`}>
          <img 
            src="./img/open-house/CIF_map.png" 
            alt="Venue Map" 
            className={styles.venueMap}
          />
          <div className={styles.mapOverlay}>
            {booths.map((booth) => {
              const table = tables.find((t) => t.id === booth.tableId) // Find corresponding Table
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
                >{booth.tableId}</div>
              )
            })}
          </div>
        </div>

        {selectedBooth && (
        <div className={ selectedBooth ? styles.boothDetails : styles.noBoothDetails}>
            <h2>{selectedBooth.name}</h2>
            <p>{selectedBooth.description}</p>
            
            <div className={styles.boothLinks}>
              {selectedBooth.links?.website && (
                <a 
                  href={selectedBooth.links.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Website
                </a>
              )}
              {selectedBooth.links?.social && (
                <a 
                  href={selectedBooth.links.social} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Social Media
                </a>
              )}
            </div>
          </div>
        )}
      </div>


      <div className={styles.boothTypesContainer}>
        {/* Committees Section */}
        <div className={styles.boothTypeSection}>
          <h3 
            className={styles.boothTypeLabel}
            onClick={() => toggleSection('Committee')}
          >
            Committees 
            <span className={styles.collapseIcon}>
              {collapsedSections['Committee'] ? '▶' : '▼'}
            </span>
          </h3>
          {!collapsedSections['Committee'] && (
            <div className={styles.boothLogosContainer}>
              {booths
                .filter(booth => booth.type === 'Committee')
                .map(booth => (
                  <div 
                    key={booth.id} 
                    className={styles.boothLogoWrapper}
                    onClick={() => handleBoothSelect(booth)}
                  >
                    <img 
                      src={booth.logo} 
                      alt={booth.name}
                      className={`${styles.boothLogo} ${
                        selectedBooth?.id === booth.id ? styles.selectedBoothLogo : ''
                      }`}
                    />
                    <span className={styles.boothLogoName}>{booth.name}</span>
                  </div>
                ))
              }
            </div>
          )}
        </div>

        {/* Similar structure for SIGs and Partners */}
        <div className={styles.boothTypeSection}>
          <h3 
            className={styles.boothTypeLabel}
            onClick={() => toggleSection('SIG')}
          >
            Special Interest Groups
            <span className={styles.collapseIcon}>
              {collapsedSections['SIG'] ? '▶' : '▼'}
            </span>
          </h3>
          {!collapsedSections['SIG'] && (
            <div className={styles.boothLogosContainer}>
              {booths
                .filter(booth => booth.type === 'SIG')
                .map(booth => (
                  <div 
                    key={booth.id} 
                    className={styles.boothLogoWrapper}
                    onClick={() => handleBoothSelect(booth)}
                  >
                    <img 
                      src={booth.logo} 
                      alt={booth.name}
                      className={`${styles.boothLogo} ${
                        selectedBooth?.id === booth.id ? styles.selectedBoothLogo : ''
                      }`}
                    />
                    <span className={styles.boothLogoName}>{booth.name}</span>
                  </div>
                ))
              }
            </div>
          )}
        </div>

        {/* Partners Section */}
        <div className={styles.boothTypeSection}>
          <h3 
            className={styles.boothTypeLabel}
            onClick={() => toggleSection('Partner')}
          >
            Partners
            <span className={styles.collapseIcon}>
              {collapsedSections['Partner'] ? '▶' : '▼'}
            </span>
          </h3>
          {!collapsedSections['Partner'] && (
            <div className={styles.boothLogosContainer}>
              {booths
                .filter(booth => booth.type === 'Partner')
                .map(booth => (
                  <div 
                    key={booth.id} 
                    className={styles.boothLogoWrapper}
                    onClick={() => handleBoothSelect(booth)}
                  >
                    <img 
                      src={booth.logo} 
                      alt={booth.name}
                      className={`${styles.boothLogo} ${
                        selectedBooth?.id === booth.id ? styles.selectedBoothLogo : ''
                      }`}
                    />
                    <span className={styles.boothLogoName}>{booth.name}</span>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </div>


    </div>
  )
}