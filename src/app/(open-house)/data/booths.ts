import {
  getOrganizationInfo,
  Link,
  Organization,
} from '@/utils/organizations';
import { OrgType, getOrgsByType } from '@acm-uiuc/js-shared';
import { partners } from '../data/partners';
import { boothDetails } from './details';

export interface Booth {
  id: number;
  type: string;
  name: string;
  logo: string;
  customLogo?: boolean;
  description: string;
  links?: Link[]; // Array of dynamic links
  keywords: string[];
  tableId?: number;
}

export type { Booth as BoothType };

const committees = getOrgsByType(OrgType.COMMITTEE);

const committeeBooths = committees
  .map((committee, index) => ({
    id: index + 1,
    type: 'Committee',
    name: committee.name,
    logo: `/assets/logos/${committee.shortcode}.png`,
    description: `${committee.name} organizes and manages ACM activities.`,
    tableId: index + 1,
    keywords: ['committee', committee.shortcode],
  }));

const eventBooths = committees
  .map((committee, index) => ({
    id: committeeBooths.length + index + 1,
    type: 'Committee',
    name: committee.name,
    logo: `/assets/logos/${committee.shortcode}.png`,
    description: `${committee.name} is a partner organization.`,
    tableId: committeeBooths.length + index + 1,
    keywords: ['committee', committee.shortcode],
  }));

const sigs = getOrgsByType(OrgType.SIG).filter(
  (sig) => sig.name !== 'SIGMobile' && sig.name !== 'SIGARCH'
);

const sigBooths = sigs.map((sig, index) => {
  const orgInfo = getOrganizationInfo(sig.name as Organization);
  return {
    id: eventBooths.length + committeeBooths.length + index + 1,
    type: 'SIG',
    name: orgInfo.title,
    logo: `/assets/logos/${sig.shortcode}.png`,
    description: orgInfo.description,
    tableId: eventBooths.length + committeeBooths.length + index + 1,
    keywords: orgInfo.description.split(' '), // Generate Keywords from description
    links: orgInfo.links,
  };
});

const partnerBooths = partners.map((partner, index) => ({
  id:
    sigBooths.length + eventBooths.length + committeeBooths.length + index + 1,
  type: 'Partner',
  name: partner.name,
  logo: partner.logo,
  customLogo: partner.customLogo,
  description: partner.description,
  tableId:
    sigBooths.length + committeeBooths.length + eventBooths.length + index + 1,
  keywords: partner.keywords,
  links: partner.links,
}));

// Combine all booths
const baseBooths = [
  ...sigBooths,
  ...committeeBooths,
  ...eventBooths,
  ...partnerBooths,
];

const getMergedBooths = (booths: Booth[]): Booth[] => {
  return booths.map((booth) => {
    const override = boothDetails[booth.id];
    return {
      ...booth,
      ...override, // Override with manual details
      links: [...(booth.links || []), ...(override?.links || [])], // Combine both default and override links
      keywords: override?.keywords || booth.keywords, // Keywords from override or default
    };
  });
};

const booths = getMergedBooths(baseBooths);

export default booths;
