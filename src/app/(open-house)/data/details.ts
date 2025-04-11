import { BoothType } from './booths';
import { Link } from '@/utils/organizations';

export interface IBoothDetails {
  name?: string;
  description?: string;
  customLogo?: boolean;
  logo?: string;
  links?: Link[];
  keywords?: string[];
  tableId?: number;
}

// Record mapping booth IDs to their manual overrides
export const boothDetails: Record<BoothType['id'], IBoothDetails> = {
  '1': {
    description:
      'Manages ACM @ UIUC’s core software engineering and infrastructure efforts by building robust and scalable solutions.',
    links: [
      { text: 'Website', link: 'https://infra.acm.illinois.edu' },
      { text: 'GitHub', link: 'https://github.com/acm-uiuc/' },
    ],
    keywords: ['infrastructure', 'tech', 'engineering', 'swe', 'infra'],
    tableId: 5,
  },
  '2': {
    links: [
      { text: 'Website', link: 'https://acm-infra.com' },
      { text: 'GitHub', link: 'https://github.com/acm-infra' },
    ],
    keywords: ['social', 'community', 'engagement'],
    tableId: 0,
  },
  '3': {
    description: 'Moneyballers of ACM@UIUC. We handle all things finance.',
    tableId: 13,
  },
  '4': {
    description:
      "The marketing team is responsible for promoting ACM@UIUC's events and initiatives, ensuring that our community stays informed and engaged.",
    keywords: ['marketing', 'promotion', 'community'],
    tableId: 15,
  },
  '5': {
    description:
      'The mentorship team is dedicated to providing guidance and support to ACM@UIUC members, helping them navigate their academic and professional journeys.',
    keywords: ['mentorship', 'guidance', 'support'],
    tableId: 6,
  },
  '6': {
    description:
      "The academic team is responsible for organizing and managing ACM@UIUC's academic events, including workshops, seminars, and study sessions.",
    keywords: ['academic', 'workshops', 'seminars'],
    links: [{ text: 'Website', link: 'https://academic.acm.illinois.edu/' }],
    tableId: 17,
  },
  '7': {
    description:
      'Reflections | Projections is a premier computer science conference that brings together students, professionals, and industry leaders to share knowledge and insights.',
    links: [
      { text: 'Website', link: 'https://www.reflectionsprojections.org/' },
      { text: 'Application', link: 'https://bit.ly/rp2025application' },
    ],
    keywords: ['conference', 'technology', 'networking'],
    tableId: 14,
  },
  '8': {
    description:
      "HackIllinois is UIUC's premier collegiate hackathon that brings together students, professionals, and industry leaders to collaborate and innovate.",
    links: [
      { text: 'Website', link: 'https://www.hackillinois.org/' },
      { text: 'Register', link: 'https://www.hackillinois.org/register' },
    ],
    customLogo: true,
    logo: 'https://avatars.githubusercontent.com/u/5751098?v=4',
    keywords: ['hackathon', 'registration', 'technology'],
    tableId: 16,
  },
  '9': {
    tableId: 35,
  },
  '10': {
    tableId: 21,
    links: [
      {
        text: 'Coda',
        link: 'https://coda.io/d/SIGCHI_dL-hkhRaxQN/Home_suXrh_ME#_lu90Yca6',
      },
    ],
  },
  '11': {
    tableId: 34,
  },
  '12': {
    tableId: 18,
  },
  '13': {
    tableId: 27,
  },
  '14': {
    tableId: 20,
  },
  '15': {
    tableId: 0,
    links: [{ text: 'GitHub', link: 'https://github.com/sigmusic' }],
  },
  '16': {
    name: 'SIGSYS',
    logo: 'https://www.shareicon.net/data/512x512/2015/08/13/84466_terminal_512x512.png',
    customLogo: true,
    description:
      'Learn about Operating Systems, Netorking, Compilers, Distributed Systems, and more! Featured at the GLUG table.',
    keywords: [
      'SIG',
      'systems',
      'networking',
      'compilers',
      'distributed systems',
    ],
    tableId: 19,
  },
  '17': {
    tableId: 19,
    keywords: ['FOSS', 'BSD', 'plan9', '9front', 'systems'],
  },
  '18': {
    tableId: 28,
  },
  '19': {
    tableId: 22,
  },
  '20': {
    tableId: 23,
    logo: './img/open-house/logos/SIGQuantum.svg',
    customLogo: true,
  },
  '21': {
    tableId: 26,
  },
  '22': {
    tableId: 30,
  },
  '23': {
    tableId: 32,
    keywords: ['machine learning', 'robotics'],
  },
  '24': {
    tableId: 31,
  },
  '25': {
    tableId: 8,
  },
  '26': {
    tableId: 3,
  },
  '27': {
    tableId: 4,
  },
  '28': {
    tableId: 0,
  },
  '29': {
    tableId: 9,
  },
  '30': {
    tableId: 0,
  },
  '31': {
    tableId: 10,
  },
};
