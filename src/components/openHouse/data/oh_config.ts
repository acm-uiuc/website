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
  S17: { demo_time: '7:05 – 7:15 PM' }, // SIGRobotics
  C08: { demo_time: '7:20 – 7:30 PM' }, // HackIllinois
  S03: { demo_time: '7:35 – 7:45 PM' }, // GameBuilders
  S13: { demo_time: '7:50 – 8:00 PM' }, // SIGecom
};

/**
 * Partner organizations not in the API. Keyed by partner ID.
 *
 * IDs are stable across years, so an org that came back keeps the ID (and the
 * logo file) it had before. Entries tagged `presenting only` are confirmed for
 * the event but are not getting a table, so they belong in this directory but
 * not in assignments_config.json.
 */
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
    links: [{ text: 'Website', url: 'https://projectcodeuiuc.org/' }],
  },
  P09: {
    name: 'CS STARS',
    type: 'partner',
    description: 'TODO: add description.',
  },
  /** presenting only -- no table. */
  P10: {
    name: 'AI Alignment',
    type: 'partner',
    description: 'TODO: add description.',
  },
  /** presenting only -- no table. */
  P11: {
    name: 'Agentic AI @ UIUC',
    type: 'partner',
    description: 'TODO: add description.',
  },
  /** presenting only -- no table. */
  P12: {
    name: 'Illini Solar Car',
    type: 'partner',
    description: 'TODO: add description.',
  },
  /** presenting only -- no table. */
  P13: {
    name: 'Women in Data Science',
    type: 'partner',
    description: 'TODO: add description.',
  },
};
