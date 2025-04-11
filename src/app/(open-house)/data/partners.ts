import { BoothType } from './booths';

export const partners: BoothType[] = [
  {
    id: 25,
    type: 'Partner',
    name: 'WCS',
    logo: './img/open-house/logos/wcs.png',
    customLogo: true,
    description:
      'We are a non-profit educational student group under the UIUC Computer Science Department dedicated to supporting the efforts of young women and non-binary people in technology. We host a variety of networking events with our corporate sponsors, technical workshops and discussions, social events for our members and many more!',
    links: [{ text: 'Website', link: 'https://wcs.illinois.edu/' }],
    keywords: ['community', 'support', 'tech'],
    tableId: 27,
  },
  {
    id: 26,
    type: 'Partner',
    name: 'B[U]ILT',
    logo: './img/open-house/logos/built.png',
    customLogo: true,
    description:
      'B[U]ILT serves to provide opportunities and services for students of the university. The opportunities created are professional, academic, and social aimed at fostering a healthy and comfortable community for underrepresented students interested in tech.',
    links: [{ text: 'Slack', link: 'https://linktr.ee/built_uiuc' }],
    keywords: ['community', 'support', 'tech'],
    tableId: 28,
  },
  {
    id: 27,
    type: 'Partner',
    name: 'Project: Code',
    logo: './img/open-house/logos/projectcode.png',
    customLogo: true,
    description:
      'Project: Code was founded in 2019 to provide UIUC students of all academic backgrounds an opportunity to learn and develop their skills across a variety of CS areas/domains. Each semester, we offer a variety of projects for students to contribute to. In the past, these projects have focused on domains of CS like web development, app development, data visualization, data science, hardware engineering, machine learning, artificial intelligence, virtual reality, and game development. Each project is led by a Project Manager (PM) who has experience working with a certain area of CS.',
    links: [{ text: 'Website', link: 'https://www.projectcodeuiuc.org' }],
    keywords: ['team project'],
    tableId: 29,
  },
  {
    id: 28,
    type: 'Partner',
    name: 'SAIL 2025',
    logo: './img/open-house/logos/sail.png',
    customLogo: true,
    description:
      'Sail is a free annual 2-day event for HS students to experience CS @ Illinois. Sail 2025 will be March 29 & 30. For current UIUC students, come teach at Sail!',
    links: [
      {
        text: 'Click Here to Learn More',
        link: 'https://forms.gle/gZjVrH91T95WUj1w8',
      },
    ],
    keywords: ['high school', 'teaching', 'mentorship'],
    tableId: 30,
  },
  {
    id: 29,
    type: 'Partner',
    name: 'Open Source at Illinois',
    logo: 'https://www.opensourceatillinois.com/_next/image?url=%2FOSAI%20tranparent%201.png&w=384&q=75',
    customLogo: true,
    description:
      'Open Source at Illinois is an organisation that promotes open source development at UIUC through projects and workshops. We have made projects on Github related to Computer Vision, LLMs, Web development, and more. The workshops cover modern-day technologies being used in the industry.',
    links: [{ text: 'Website', link: 'https://opensourceatillinois.com/' }],
    keywords: ['open source', 'development', 'community'],
    tableId: 31,
  },
  {
    id: 30,
    type: 'Partner',
    name: 'CS 124 Honors',
    logo: './img/open-house/logos/cs124h.png',
    customLogo: true,
    description:
      'CS 124 Honors is the honors section of CS124 that aims to provide students a more in-depth CS @ Illinois experience. The course is designed to engage students with the CS community at UIUC and help them find interests through a hands-on project-based approach. To that end, we will focus on two goals during the semester: developing practical programming skills and providing in-depth mentorship.',
    links: [{ text: 'Website', link: 'https://honors.cs124.org/' }],
    keywords: ['course', 'education', 'honors'],
    tableId: 32,
  },
  {
    id: 31,
    type: 'Partner',
    name: 'AQTE',
    logo: './img/open-house/logos/aqte.jpg',
    customLogo: true,
    description:
      'The mission of the Association for Quant Trading Education (AQTE) is to develop a community of people who are interested in quantitative finance and provide them with resources, training, and experiential learning opportunities to succeed in a multi-disciplinary and highly proprietary industry.',
    links: [
      { text: 'Website', link: 'https://quanteducation.web.illinois.edu' },
      { text: 'Discord', link: 'https://discord.gg/yDyxY72Z' },
    ],
    keywords: ['finance', 'quantitative', 'education'],
    tableId: 33,
  },
];
