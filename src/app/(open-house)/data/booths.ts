import { SIGList, CommitteeList, PartnerList, getOrganizationInfo, Link } from '@/utils/organizations';
import { partners } from '../data/partners';
import { boothDetails } from './details';

export interface Booth {
    id: number
    type: string
    name: string
    logo: string
    customLogo?: boolean
    description: string
    links?: Link[]; // Array of dynamic links
    keywords: string[]
    tableId: number
}

export type {Booth as BoothType}
  
  
const committeeBooths = CommitteeList.map((committee, index) => ({
    id: index + 1,
    type: 'Committee',
    name: committee,
    logo: `/assets/logos/${committee.toLowerCase().replace(' ', '-')}.png`,
    description: `${committee} organizes and manages ACM activities.`,
    tableId: index + 1,
    keywords: ['committee', committee.toLowerCase()],
}));

const eventBooths = PartnerList.map((committee, index) => ({
    id: committeeBooths.length + index + 1,
    type: 'Committee',
    name: committee,
    logo: `/assets/logos/${committee.toLowerCase().replace(' ', '-')}.png`,
    description: `${committee} is a partner organization.`,
    tableId: committeeBooths.length + index + 1,
    keywords: ['committee', committee.toLowerCase()],
}));

const sigBooths = SIGList.map((sig, index) => ({
    id: eventBooths.length + committeeBooths.length + index + 1,
    type: 'SIG',
    name: getOrganizationInfo(sig).title,
    logo: `/assets/logos/${sig.toLowerCase()}.png`,
    description: getOrganizationInfo(sig).description,
    tableId: eventBooths.length + committeeBooths.length + index + 1,
    keywords: getOrganizationInfo(sig).description.split(' '), // Generate Keywords from description
    links: getOrganizationInfo(sig).links,
}));

const partnerBooths = partners.map((partner, index) => ({
    id: sigBooths.length + eventBooths.length + committeeBooths.length + index + 1,
    type: 'Partner',
    name: partner.name,
    logo: partner.logo,
    description: partner.description,
    tableId: sigBooths.length + committeeBooths.length + eventBooths.length + index + 1,
    keywords: partner.keywords,
    links: partner.links,
}));

// Combine all booths
const baseBooths = [...sigBooths, ...committeeBooths, ...eventBooths, ...partnerBooths];

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