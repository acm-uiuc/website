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
  S13: { demo_time: '8:10 - 8:15 PM' },
};

/** Partner organizations not in the API. Keyed by partner ID. */
export const partnerOrgs: Record<string, PartnerOrg> = {
  P01: {
    name: 'UIUC RetroTech',
    type: 'partner',
    description:
      "We discuss, repair, and modify retro and vintage technology! We also have events like CRT watch parties, collaborating with other RSOs, and tabling at VCFMW (Vintage Computer Fest Midwest.) Our meetings are typically in the ECEB OpenLab Thursdays at 7 PM. We are beginner-friendly - you don't need to own or have any experience with repairing retro technology to join",
    demo_time: '8:25 - 8:30 PM',
    links: [
      { text: 'Instagram', url: 'https://www.instagram.com/uiuc_retrotech/' },
    ],
  },
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
  P05: {
    name: 'QueerCoded',
    type: 'partner',
    description:
      'QueerCoded is a new student org for LGBTQ+ students and allies in computer science. We aim to provide a safe and welcoming community for LGBTQ+ students in computer science and adjacent fields to talk about their experiences and interests in CS. We will have a room in the Siebel basement (room number TBD) open to all, come visit us and join us at upcoming social events! As we are new, we are looking for passionate student leaders to help run QueerCoded, please email al68@illinois.edu if you are interested!',
    links: [{ text: 'Discord', url: 'https://discord.gg/47eqFA8Jcp' }],
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
  P07: {
    name: 'Project: Code',
    type: 'partner',
    description:
      'Project: Code is an RSO that connects students with interesting project ideas to students who want to work on interesting projects!',
    demo_time: '8:20 - 8:25 PM',
    links: [{ text: 'Website', url: 'https://projectcodeuiuc.org/' }],
  },
  P08: {
    name: 'CS 124 Honors',
    type: 'partner',
    description:
      'CS 124 Honors is the honors section of CS124 that aims to provide students a more in-depth CS @ Illinois experience through a hands-on project-based approach.',
    links: [{ text: 'Website', url: 'https://honors.cs124.org' }],
  },
};
