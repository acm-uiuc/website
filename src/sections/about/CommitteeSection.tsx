'use client';
import Committee from '@/components/Card/CommitteeCard';

import social from '@/stories/assets/social-logo.png';
import marketing from '@/stories/assets/marketing-logo.png';
import reflections from '@/stories/assets/reflections.jpg';
import hackillinoislogo from '@/stories/assets/hackillinoislogo.png';
import corporatelogo from '@/stories/assets/corporate-logo.png';
import infrastructure from '@/stories/assets/infra-logo.png';
import academic from '@/stories/assets/accom-logo.png';
import mentorship from '@/stories/assets/mentorship-logo.png';

export default function CommitteeSection() {
  return (
    <section id="committees" className="container flex flex-col gap-6">
      <h1>Committees</h1>
      <span id="reflections">
        <Committee
          title="Reflections | Projections"
          description="We provide a forum to share and learn about progress 
          in computer science, with industry and academia 
          tech talks, workshops and events 
          for attendees, Mechmania, and Diversity × Tech."
          image={reflections}
          href="https://reflectionsprojections.org/"
          chairs={[
            {
              name: 'Cole Jordan',
              email: 'coleej2@illinois.edu',
            },
            {
              name: 'Shreenija Daggavolu',
              email: 'srd8@illinois.edu',
            },
          ]}
        />
      </span>
      <span id="hackillinois">
        <Committee
          title="HackIllinois"
          description="HackIllinois is UIUC's premier collegiate hackathon. 
          With over 1000 attendees and 50 mentors in 2019, the hackathon 
          has become one of the largest and most well-regarded in the 
          nation."
          image={hackillinoislogo}
          href="https://hackillinois.org/"
          chairs={[
            {
              name: 'Aydan Pirani',
              email: 'apirani2@illinois.edu',
            },
            {
              name: 'Nancy Zhang',
              email: 'nzhan2@illinois.edu',
            },
          ]}
        />
      </span>
      <span id="corporate">
        <Committee
          title="Corporate"
          description="The corporate team handles communication with ACM@UIUC's sponsors."
          image={corporatelogo}
          chairs={[
            {
              name: 'Deeya Bodas',
              email: 'deeyaab2@illinois.edu',
            },
            {
              name: 'Adya Daruka',
              email: 'adaruka2@illinois.edu',
            },
          ]}
        />
      </span>
      <span id="infrastructure">
        <Committee
          title="Infrastructure"
          description="The infra team maintains ACM@UIUC's infrastructure and engineering efforts
          like this website."
          image={infrastructure}
          href="https://infra.acm.illinois.edu/"
          chairs={[
            {
              name: 'Dev Singh',
              email: 'dsingh14@illinois.edu',
            },
            {
              name: 'Kay Rivera',
              email: 'krive5@illinois.edu',
            },
          ]}
        />
      </span>
      <span id="academic">
        <Committee
          title="Academic"
          description="The academic committee organizes review events for CS courses and interfaces with professors to enable student success in courses."
          image={academic}
          href="https://academic.acm.illinois.edu/"
          chairs={[
            {
              name: 'Yanni Zhuang',
              email: 'yanniz3@illinois.edu',
            },
          ]}
        />
      </span>
      <span id="social">
        <Committee
          title="Social"
          description="The social team organizes fun events for ACM@UIUC such as 
          picnics, activity weeks, game nights, and Happy Hour."
          image={social}
          chairs={[
            {
              name: 'Ashika Koripelly',
              email: 'akori3@illinois.edu',
            },
            {
              name: 'Naomi Lin',
              email: 'naomil4@illinois.edu',
            },
          ]}
        />
      </span>
      <span id="marketing">
        <Committee
          title="Marketing"
          description="The marketing team organizes social media and branding for ACM@UIUC."
          image={marketing}
          chairs={[
            {
              name: 'Ayushi Chakravarty',
              email: 'ayushic3@illinois.edu',
            },
            {
              name: 'Meghna Goli',
              email: 'goli3@illinois.edu',
            },
          ]}
        />
      </span>
      <span id="mentorship">
        <Committee
          title="Mentorship"
          description="The mentorship team organizes mentorship programs for ACM@UIUC, welcoming everyone to CS @ Illinois."
          image={mentorship}
          chairs={[
            {
              name: 'Jasmine Liu',
              email: 'jrliu2@illinois.edu',
            },
            {
              name: 'Alice Fan',
              email: 'alfan2@illinois.edu',
            },
          ]}
        />
      </span>
    </section>
  );
}
