import { Organization, SIGList } from "@/components/LazyImage";

interface Link {
  link: string
  text: string
}

export interface IOrgData {
  title: string;
  description: string;
  links: Link[];
}

export const OrganizationDataMapping : Record<Organization, IOrgData> = {
  'SIGPwny': {
    title: 'SIGPwny',
    description: 'Learn cybersecurity from the ground up, play in competitions, and do research. Beginners welcome!',
    links: [
      {
        link: 'https://sigpwny.com/',
        text: 'Website'
      },
      {
        link: 'https://sigpwny.com/discord',
        text: 'Discord'
      }
    ]
  },
  'SIGAIDA': {
    title: 'SIGAIDA',
    description: 'We are the premier data science organization at UIUC, inspiring students to reshape their perspective on data.',
    links: [
      {
        link: 'https://sigaida.com/',
        text: 'Website'
      },
      {
        link: 'https://go.acm.illinois.edu/aida_discord',
        text: 'Discord'
      }
    ]
  },
  'SIGMobile': {
    title: 'SIGMobile',
    description: 'A mobile development club with Android tutorials, iOS tutorials, guest lectures, and group projects.',
    links: [
      {
        link: 'https://apoorvaditya.notion.site/SIGMobile-dc12c5f971aa43ffbd5435d8fcae91fe',
        text: 'Notion'
      },
      {
        link: 'https://discord.gg/af6SvFWGSc',
        text: 'Discord'
      }
    ]
  },
  'GameBuilders': {
    title: 'GameBuilders',
    description: 'Anything and everything related to game development and design. All skill levels and abilities are welcome.',
    links: [
      {
        link: 'https://gamebuilders.acm.illinois.edu/',
        text: 'Website'
      },
      {
        link: 'https://discordapp.com/invite/2rND6FT',
        text: 'Discord'
      }
    ]
  },
  'SIGGRAPH': {
    title: 'SIGGRAPH',
    description: 'Learn computer graphics in guided projects on 3D renderings, animations, physics simulations, and more.',
    links: [
      {
        link: 'https://siggraph.acm.illinois.edu/#/',
        text: 'Website'
      },
      {
        link: 'https://discord.com/invite/a5U333fNMX',
        text: 'Discord'
      }
    ]
  },
  'ICPC': {
    title: 'ICPC',
    description: 'Polish coding and problem solving skills to prepare for competitions/interviews at Illinois Programming League.',
    links: [
      {
        link: 'http://icpc.cs.illinois.edu/',
        text: 'Website'
      },
      {
        link: 'http://go.acm.illinois.edu/icpc_discord',
        text: 'Discord'
      }
    ]
  },
  'SIGCHI': {
    title: 'SIGCHI',
    description: 'Learn about human-computer interaction in research, projects, and workshops while meeting new people.',
    links: [
      {
        link: 'https://sigchi.acm.illinois.edu/',
        text: 'Website'
      },
      {
        link: 'https://discord.gg/XRShsPCAQ3',
        text: 'Discord'
      }
    ]
  },
  'GLUG': {
    title: 'GLUG',
    description: 'Immerse yourself in Linux-based operating systems and the wider open source world.',
    links: [
      {
        link: 'http://lug.acm.illinois.edu/',
        text: 'Website'
      },
      {
        link: 'https://discord.gg/sWD3zxPyc2',
        text: 'Discord'
      },
      {
        link: 'https://matrix.to/#/#gnulug:matrix.org',
        text: 'Matrix'
      }
    ]
  },
  'SIGMusic': {
    title: 'SIGMusic',
    description: 'A project-based SIG with presentations focused on audio synthesis, algorithmic composition, audio plugins, and more.',
    links: [
      {
        link: 'http://sigmusic.acm.illinois.edu/',
        text: 'Website'
      },
      {
        link: 'http://go.acm.illinois.edu/sigmusic_discord',
        text: 'Discord'
      }
    ]
  },
  'SIGQuantum': {
    title: 'SIGQuantum',
    description: 'Our SIG provides inclusive environment for students to discover and disrupt the Quantum Computing community.',
    links: [
      {
        link: 'https://discord.gg/PmaXeHPaFs',
        text: 'Discord'
      }
    ]
  },
  'SIGma': {
    title: 'SIGma',
    description: 'The place to learn about math and algorithms in CS. Open to all regardless of mathematical background.',
    links: [
      {
        link: 'https://cstheory.org',
        text: 'Website'
      },
      {
        link: 'https://discord.gg/Sxf3h3pBbv',
        text: 'Discord'
      }
    ]
  },
  'SIGNLL': {
    title: 'SIGNLL',
    description: 'Natural language processing theory: projects, workshops, and learning techniques at this SIG.',
    links: [
      {
        link: 'https://discord.gg/wwYeewYkCG',
        text: 'Discord'
      }
    ]
  },
  'SIGecom': {
    title: 'SIGecom',
    description: 'Learn about the intersection of economics and computation. Open to all, regardless of background.',
    links: [
      {
        link: 'https://go.acm.illinois.edu/ecom_discord',
        text: 'Discord'
      }
    ]
  },
  'SIGPLAN': {
    title: 'SIGPLAN',
    description: 'Learn about the theory behind programming languages and type systems, and then make projects!',
    links: [
      {
        link: 'https://discord.gg/t4TmDRDf9c',
        text: 'Discord'
      }
    ]
  },
  'SIGPolicy': {
    title: 'SIGPolicy',
    description: 'Discuss and understand software policy, ethics, law, and current events through a technological lens.',
    links: [
      {
        link: 'https://sigpolicy.acm.illinois.edu',
        text: 'Website'
      },
      {
        link: 'https://discord.gg/gKjMH54YBF',
        text: 'Discord'
      }
    ]
  },
  'SIGARCH': {
    title: 'SIGARCH',
    description: 'Dedicated to teaching and exploring computer architecture, hardware security, and more.',
    links: [
      {
        link: 'https://sigarch.net/',
        text: 'Website'
      },
      {
        link: 'https://discord.gg/Mx8R389hWz',
        text: 'Discord'
      }
    ]
  },
  'SIGRobotics': {
    title: 'SIGRobotics',
    description: 'Learn fundamental robotics skills through hands-on projects, workshops, and speaker events.',
    links: [
      {
        link: 'https://discord.gg/Rj75e5qGT3',
        text: 'Discord'
      }
    ]
  },
  'ACM': {
    title: 'ACM',
    description: 'The Association for Computing Machinery at the University of Illinois at Urbana-Champaign.',
    links: [
      {
        link: 'https://acm.illinois.edu/',
        text: 'Website'
      },
      {
        link: 'https://go.acm.illinois.edu/discord',
        text: 'Discord'
      }
    ]
  }
}

export const getOrganizationInfo = (organization: Organization) => OrganizationDataMapping[organization];

export const AllSigData: IOrgData[] = SIGList.filter(item => item in OrganizationDataMapping).map((sig) => OrganizationDataMapping[sig]);