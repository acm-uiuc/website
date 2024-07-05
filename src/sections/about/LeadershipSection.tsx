import LeadershipCard from '@/components/Card/LeadershipCard';

import chair from "@/stories/assets/chair.jpeg";
import vicechair from "@/stories/assets/vice_chair.jpg";
import treasurer from "@/stories/assets/treasurer.jpg";
import secretary from "@/stories/assets/secretary.jpg";

export default function LeadershipSection() {
  return (
    <section id="leadership" className="container flex flex-col gap-6">
      <h1>Leadership</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <LeadershipCard
          title="Chair"
          name="Abhived Pulapaka"
          img={chair}
          email="mailto:abhived2@illinois.edu"
        />
        <LeadershipCard 
          title="Vice Chair"
          name="Ronit Anandani" 
          img={vicechair} 
          email="mailto:ronita2@illinois.edu"
        />
        <LeadershipCard 
          title="Treasurer"
          name="Ryan To"
          img={treasurer} 
          email="mailto:treasurer@acm.illinois.edu"
        />
        <LeadershipCard 
          title="Secretary"
          name="Akshay Vellore"
          img={secretary}
          email="mailto:akshayv4@illinois.edu"
        />
      </div>
    </section>
  );
};