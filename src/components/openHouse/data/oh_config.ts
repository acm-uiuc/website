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
  S17: { demo_time: '7:10 – 7:20 PM' }, // SIGRobotics
  S03: { demo_time: '7:30 – 7:40 PM' }, // GameBuilders
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
      'Empowering underrepresented voices in computing at UIUC — join us in building a diverse future!',
    links: [
      { text: 'Website', url: 'https://built-illinois.org/#/Home' },
      {
        text: 'Instagram',
        url: 'https://www.instagram.com/built_by_colorstack/',
      },
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
      'QueerCoded @ UIUC provides a safe and welcoming community for LGBTQ+ students in CS and adjacent fields.',
    links: [{ text: 'Discord', url: 'https://discord.gg/47eqFA8Jcp' }],
  },
  P06: {
    name: 'CS Sail',
    type: 'partner',
    description:
      'CS Sail hosts the largest CS outreach event at Illinois! Sail is a free annual 2-day event for HS students to experience CS @ Illinois.',
  },
  P07: {
    name: 'Project: Code',
    type: 'partner',
    description:
      'Project: Code is an RSO that connects students with interesting project ideas to students who want to work on interesting projects!',
    links: [
      {
        text: 'Instagram',
        url: 'https://www.instagram.com/project.code.uiuc/',
      },
    ],
  },
  P09: {
    name: 'CS STARS',
    type: 'partner',
    description:
      'Illinois CS Student Ambassadors/Research Scholars (CS STARS) is designed for University of Illinois CS or blended CS undergraduate students interested in pursuing undergraduate research in a chosen area of interest while also serving as school leaders to recruit students to the CS majors and empower CS undergraduates.',
    links: [
      {
        text: 'Website',
        url: 'https://siebelschool.illinois.edu/broadening-participation-computing/programs/csambassadors',
      },
    ],
  },
  /** presenting only -- no table. */
  P10: {
    name: 'AI Alignment',
    type: 'partner',
    description:
      'AI Alignment is a registered student organization at the University of Illinois Urbana-Champaign, running six tracks on making advanced AI systems safe, from first principles to independent research and AI governance. Open to all majors.',
  },
  /** presenting only -- no table. */
  P11: {
    name: 'Agentic AI @ UIUC',
    type: 'partner',
    description:
      "The club's mission is to help students build a deep understanding of how modern AI agents work — from context retrieval and orchestration layers to tool integration and autonomous decision-making. Members engage in hands-on workshops, research projects, and collaborative builds, exploring how agentic AI can transform industries from finance to education to software development.",
  },
  /** presenting only -- no table. */
  P12: {
    name: 'Illini Solar Car',
    type: 'partner',
    description:
      "Started in 2014, Illini Solar Car has been designing, building, and racing some of America's best solar cars. With thousands of miles of racing under our belts, we are dedicated to making our next car the best yet.",
  },
  /** presenting only -- no table. */
  P13: {
    name: 'Women in Data Science',
    type: 'partner',
    description:
      'Women in Data Science (WiDS) Urbana-Champaign is independently organized by students at the University of Illinois Urbana-Champaign to be part of the mission to increase participation of women in data science and to feature outstanding women doing outstanding work.',
  },
};
