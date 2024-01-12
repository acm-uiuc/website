'use client';
import Committee from '@/components/Card/CommitteeCard';
import ExtLink from '@/components/Link';

import social from '@/stories/assets/social.jpg';
import capitalone from '@/stories/assets/capitalone.png';
import instagram from '@/stories/assets/instagram.png';
import reflections from '@/stories/assets/reflections.jpg';
import hackillinoislogo from '@/stories/assets/hackillinoislogo.png';
import infrastructure from '@/stories/assets/infra_pic.jpg';

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
              name: "Saloni Vaishnav",
              email: "saloniv2@illinois.edu"
            },
            {
              name: "Atharva Naik",
              email: "annaik2@illinois.edu"
            }
          ]}
        />
      </span>
      <span id="hackillinois">
        <Committee
          title="HackIllinois"
          description="HackIllinois is the premier collegiate hackathon. 
          With over 1000 attendees and 50 mentors in 2019, the hackathon 
          has become one of the largest and most well-regarded in the 
          nation."
          image={hackillinoislogo}
          href="https://hackillinois.org/"
          chairs={[
            {
              name: "Pinakin Kanade",
              email: "pkanade2@illinois.edu"
            },
            {
              name: "Ronit Anandani",
              email: "ronita2@illinois.edu"
            }
          ]}
        />
      </span>
      <span id="corporate">
        <Committee
          title="Corporate"
          description="The corporate team handles communication with ACM@UIUC's sponsors, 
          including Numerade, IMC, and more."
          image={capitalone}
          chairs={[
            {
              name: "Anish Meka",
              email: "anishm2@illinois.edu"
            }
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
              name: "A.G. Samaniego",
              email: "asama6@illinois.edu"
            },
            {
              name: "Sai Venkatakrishnan",
              email: "sv34@illinois.edu"
            }
          ]}
        />
      </span>
      <span id="marketing">
        <Committee
          title="Marketing"
          description="The marketing team organizes social media and branding for ACM@UIUC."
          image={instagram}
          chairs={[
            {
              name: "Kylie Zhang",
              email: "kyliez2@illinois.edu"
            },
            {
              name: "Jingtong Wang",
              email: "jw132@illinois.edu"
            }
          ]}
        />
      </span>
      <span id="infrastructure">
        <Committee
          title="Infrastructure"
          description="The infra team maintains ACM@UIUC's infrastructure and engineering efforts
          like this website."
          image={infrastructure}
          chairs={[
            {
              name: "Jake Levine",
              email: "jlevine4@illinois.edu"
            },
            {
              name: "Hassam Uddin",
              email: "hassamu2@illinois.edu"
            }
          ]}
        />
      </span>
    </section>
  );
};