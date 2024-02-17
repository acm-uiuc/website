import LeadershipCard from '@/components/Card/LeadershipCard';

import chair from "@/stories/assets/chair.jpeg";
import vicechair from "@/stories/assets/vicechair.jpg";
import treasurer from "@/stories/assets/treasurer.jpeg";
import secretary from "@/stories/assets/secretary.jpeg";

export default function LeadershipSection() {
  return (
    <section id="leadership" className="container flex flex-col gap-6">
      <h1>Leadership</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <LeadershipCard
          title="Chair"
          name="Deeya Bodas"
          img={chair}
          email="mailto:deeyaab2@illinois.edu"
        />
        <LeadershipCard 
          title="Vice Chair"
          name="Aydan Pirani" 
          img={vicechair} 
          email="mailto:apirani2@illinois.edu"
        />
        <LeadershipCard 
          title="Treasurer"
          name="Dev Singh"
          img={treasurer} 
          email="mailto:treasurer@acm.illinois.edu"
        />
        <LeadershipCard 
          title="Secretary"
          name="Abhived Pulapaka"
          img={secretary}
          email="mailto:abhived2@illinois.edu"
        />
      </div>
    </section>
  );
};