import LeadershipCard from '@/components/Card/LeadershipCard';

import chair from "@/stories/assets/chair.jpg";
import vicechair from "@/stories/assets/vicechair.jpg";
import treasurer from "@/stories/assets/treasurer.jpg";
import secretary from "@/stories/assets/secretary.jpg";

export default function LeadershipSection() {
  const cards = [
    <LeadershipCard
      title="Chair"
      name="Ronit Anandani"
      img={chair}
      email="mailto:ronita2@illinois.edu"
    />,
    <LeadershipCard
      title="Treasurer"
      name="Ryan To"
      img={treasurer}
      email="mailto:treasurer@acm.illinois.edu"
    />,
    <LeadershipCard
      title="Secretary"
      name="Akshay Vellore"
      img={secretary}
      email="mailto:akshayv4@illinois.edu"
    />

  ]
  return (
    <section id="leadership" className="container flex flex-col gap-6">
      <h1>Leadership</h1>
      <div className={`grid gap-6 grid-cols-1 sm:grid-cols-${Math.floor(cards.length / 2)} lg:grid-cols-${cards.length}`}>
        {cards}
      </div>
    </section>
  );
};