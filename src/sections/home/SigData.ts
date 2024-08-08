import { Organization, SIGList } from "@/components/LazyImage";

export interface IOrgData {
  title: string;
  description: string;
  link1?: string;
  link2: string;
  linktext1?: string;
  linktext2: string;
  link3?: string;
  linktext3?: string;
}

export const OrganizationDataMapping : Record<Organization, IOrgData> = {
  'SIGPwny': {
    title: 'SIGPwny',
    description: 'Learn cybersecurity from the ground up, play in competitions, and do research. Beginners welcome!',
    link1: 'https://sigpwny.com/',
    link2: 'https://sigpwny.com/discord',
    linktext1: 'Website',
    linktext2: 'Discord'
  },
  'SIGAIDA': {
    title: 'SIGAIDA',
    description: 'We are the premier data science organization at UIUC, inspiring students to reshape their perspective on data.',
    link2: 'https://go.acm.illinois.edu/aida_discord',
    linktext2: 'Discord'
  },
  'SIGMobile': {
    title: 'SIGMobile',
    description: 'A mobile development club with Android tutorials, iOS tutorials, guest lectures, and group projects.',
    link1: 'https://apoorvaditya.notion.site/SIGMobile-dc12c5f971aa43ffbd5435d8fcae91fe',
    link2: 'https://discord.gg/af6SvFWGSc',
    linktext1: 'Notion',
    linktext2: 'Discord'
  },
  'GameBuilders': {
    title: 'GameBuilders',
    description: 'Anything and everything related to game development and design. All skill levels and abilities are welcome.',
    link1: 'https://gamebuilders.acm.illinois.edu/',
    link2: 'https://discordapp.com/invite/2rND6FT',
    linktext1: 'Website',
    linktext2: 'Discord'
  },
  'SIGGRAPH': {
    title: 'SIGGRAPH',
    description: 'Learn computer graphics in guided projects on 3D renderings, animations, physics simulations, and more.',
    link1: 'https://siggraph.acm.illinois.edu/#/',
    link2: 'https://discord.com/invite/a5U333fNMX',
    linktext1: 'Website',
    linktext2: 'Discord'
  },
  'ICPC': {
    title: 'ICPC',
    description: 'Polish coding and problem solving skills to prepare for competitions/interviews at Illinois Programming League.',
    link1: 'http://icpc.cs.illinois.edu/',
    link2: 'http://go.acm.illinois.edu/icpc_discord',
    linktext1: 'Website',
    linktext2: 'Discord'
  },
  'SIGCHI': {
    title: 'SIGCHI',
    description: 'Learn about human-computer interaction in research, projects, and workshops while meeting new people.',
    link1: 'https://sigchi.acm.illinois.edu/',
    link2: 'https://discord.gg/XRShsPCAQ3',
    linktext1: 'Website',
    linktext2: 'Discord'
  },
  'GLUG': {
    title: 'GLUG',
    description: 'Immerse yourself in Linux-based operating systems and the wider open source world.',
    link1: 'http://lug.acm.illinois.edu/',
    link2: 'https://discord.gg/sWD3zxPyc2',
    link3: 'https://matrix.to/#/#gnulug:matrix.org',
    linktext1: 'Website',
    linktext2: 'Discord',
    linktext3: 'Matrix'
  },
  'SIGMusic': {
    title: 'SIGMusic',
    description: 'A project-based SIG with presentations focused on audio synthesis, algorithmic composition, audio plugins, and more.',
    link1: 'http://sigmusic.acm.illinois.edu/',
    link2: 'http://go.acm.illinois.edu/sigmusic_discord',
    linktext1: 'Website',
    linktext2: 'Discord'
  },
  'SIGQuantum': {
    title: 'SIGQuantum',
    description: 'Our SIG provides inclusive environment for students to discover and disrupt the Quantum Computing community.',
    link2: 'https://discord.gg/PmaXeHPaFs',
    linktext2: 'Discord'
  },
  'SIGma': {
    title: 'SIGma',
    description: 'The place to learn about math and algorithms in CS. Open to all regardless of mathematical background.',
    link1: 'https://cstheory.org',
    link2: 'https://discord.gg/Sxf3h3pBbv',
    linktext1: 'Website',
    linktext2: 'Discord'
  },
  'SIGNLL': {
    title: 'SIGNLL',
    description: 'Natural language processing theory: projects, workshops, and learning techniques at this SIG.',
    link2: 'https://discord.gg/wwYeewYkCG',
    linktext2: 'Discord'
  },
  'SIGecom': {
    title: 'SIGecom',
    description: 'Learn about the intersection of economics and computation. Open to all, regardless of background.',
    link2: 'https://go.acm.illinois.edu/ecom_discord',
    linktext2: 'Discord'
  },
  'SIGPLAN': {
    title: 'SIGPLAN',
    description: 'Learn about the theory behind programming languages and type systems, and then make projects!',
    link2: 'https://discord.gg/t4TmDRDf9c',
    linktext2: 'Discord'
  },
  'SIGPolicy': {
    title: 'SIGPolicy',
    description: 'Discuss and understand software policy, ethics, law, and current events through a technological lens.',
    link1: 'https://sigpolicy.acm.illinois.edu',
    link2: 'https://discord.gg/gKjMH54YBF',
    linktext1: 'Website',
    linktext2: 'Discord'
  },
  'SIGARCH': {
    title: 'SIGARCH',
    description: 'Dedicated to teaching and exploring computer architecture, hardware security, and more.',
    link1: 'https://sigarch.net/',
    link2: 'https://discord.gg/Mx8R389hWz',
    linktext1: 'Website',
    linktext2: 'Discord'
  },
  'ACM': {
    title: 'ACM',
    description: 'The Association for Computing Machinery at the University of Illinois at Urbana-Champaign.',
    link1: 'https://acm.illinois.edu/',
    link2: 'https://go.acm.illinois.edu/discord',
    linktext1: 'Website',
    linktext2: 'Discord'
  }
}

export const getOrganizationInfo = (organization: Organization) => OrganizationDataMapping[organization];

export const AllSigData = SIGList.filter(item => item in OrganizationDataMapping).map((sig) => OrganizationDataMapping[sig]);