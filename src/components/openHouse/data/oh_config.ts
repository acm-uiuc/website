/**
 * Open House-specific configuration.
 * API org data (name, description, type, links) is fetched at build time.
 * Logos are resolved by convention from src/images/logos/{orgId}.{ext}.
 * This file only contains demo time overrides and partner org definitions.
 */

export interface OHOverride {
  demo_time?: string | null;
}

export interface PartnerOrg {
  name: string;
  description: string;
  type: 'partner';
  demo_time?: string | null;
  links?: { text: string; url: string }[];
}

export interface OHOrgData {
  name: string;
  description: string;
  type: 'committee' | 'sig' | 'partner';
  logo?: string;
  demo_time?: string | null;
  links?: { text: string; url: string }[];
}

/** Overrides for API orgs. Keyed by org ID. */
export const ohOverrides: Record<string, OHOverride> = {
  S17: { demo_time: '7:00 – 7:10 PM' },
  S13: { demo_time: '7:40 – 7:50 PM' },
};

/** Partner organizations not in the API. Keyed by partner ID. */
export const partnerOrgs: Record<string, PartnerOrg> = {
  P02: {
    name: 'Women in Computer Science',
    type: 'partner',
    description:
      "We're Women in Computer Science (WCS), but you don't have to be a woman nor in computer science to join! Our mission is to promote equity and diversity and technology. To that end, we host socials, corporate networking sessions, beginner-friendly technical workshops, mentoring events, and so much more!",
    links: [
      { text: 'Website', url: 'https://wcs.illinois.edu/' },
      { text: 'Instagram', url: 'https://www.instagram.com/illinoiswcs/' },
    ],
  },
  P03: {
    name: 'B[U]ILT',
    type: 'partner',
    description:
      'Empowering underrepresented voices in computing at UIUC -- join us in building a diverse future!',
    links: [
      { text: 'Website', url: 'https://built-illinois.org/#/Home' },
      { text: 'Instagram', url: 'https://www.instagram.com/built_uiuc/' },
    ],
  },
  P04: {
    name: 'Women in Cybersecurity',
    type: 'partner',
    description:
      "Women in CyberSecurity (WiCyS) is UIUC's very own student chapter of the national organization dedicated to bringing together women in cybersecurity from academia, research and industry to share knowledge, experience, networking and mentoring. Our organization provides resources for women interested in cybersecurity through tech talks, workshops, networking opportunities, research, conferences, and leadership opportunities.",
    links: [{ text: 'Linktree', url: 'https://linktr.ee/wicys_illinois' }],
  },
  P06: {
    name: 'CS Sail',
    type: 'partner',
    description:
      'CS Sail hosts the largest CS outreach event at Illinois! Sail is a free annual 2-day event for HS students to experience CS @ Illinois.',
    links: [
      { text: 'Application Form', url: 'https://tinyurl.com/apply-sail-26' },
    ],
  },
  P09: {
    name: 'CS STARS',
    type: 'partner',
    description: 'TODO: add description.',
  },
  P10: {
    name: 'AI Alignment',
    type: 'partner',
    description: 'TODO: add description.',
  },
  P11: {
    name: 'Agentic AI @ UIUC',
    type: 'partner',
    description: 'TODO: add description.',
  },
};
