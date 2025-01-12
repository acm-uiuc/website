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
    description: 'The team behind the infrastructure and APIs powering ACM@UIUC.',
    links: [
        { text: 'Website', link: 'https://acm-infra.com' },
        { text: 'GitHub', link: 'https://github.com/acm-infra' },
    ],
    keywords: ['infrastructure', 'tech', 'engineering'],
  },
  '2': {
    links: [
        { text: 'Website', link: 'https://acm-infra.com' },
        { text: 'GitHub', link: 'https://github.com/acm-infra' },
    ],
    keywords: ["social", "community", "engagement"],
  },
  '3': {
    description: 'Moneyballers of ACM@UIUC. We handle all things finance.',
  },
  '4': {
    description: 'The marketing team is responsible for promoting ACM@UIUC\'s events and initiatives, ensuring that our community stays informed and engaged.',
    keywords: ["marketing", "promotion", "community"],
  },
  '5' : {
    description: 'The mentorship team is dedicated to providing guidance and support to ACM@UIUC members, helping them navigate their academic and professional journeys.',
    keywords: ["mentorship", "guidance", "support"],
  },
  '6' : {
    description: 'The academic team is responsible for organizing and managing ACM@UIUC\'s academic events, including workshops, seminars, and study sessions.',
    keywords: ["academic", "workshops", "seminars"],
  },
  '7' : {
    description: 'Reflections | Projections is a premier computer science conference that brings together students, professionals, and industry leaders to share knowledge and insights.',
    keywords: ["conference", "technology", "networking"],
  },
  '8' : {
    description: 'HackIllinois is a premier collegiate hackathon that brings together students, professionals, and industry leaders to collaborate and innovate.',
    customLogo: true,
    logo: 'https://avatars.githubusercontent.com/u/5751098?v=4',
    keywords: ["hackathon", "registration", "technology"],
  }
};