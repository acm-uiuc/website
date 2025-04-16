import LeadershipCard from '@/components/Card/LeadershipCard';

import chair from '@/stories/assets/chair.jpg';
import vicechair from '@/stories/assets/vicechair.jpg';
import treasurer from '@/stories/assets/treasurer.jpg';
import secretary from '@/stories/assets/secretary.jpg';
import Link from 'next/link';

export default function LeadershipSection() {
  const cards = [
    <LeadershipCard
      key={'chair'}
      title="Chair"
      name="Jacob Levine"
      img={chair}
      email="mailto:jlevine4@illinois.edu"
    />,
    <LeadershipCard 
      key={"vicechair"}
      title="Vice Chair"
      name="Sherry Long" 
      img={vicechair} 
      email="mailto:sherryl4@illinois.edu"
    />,
    <LeadershipCard
      key={'treasurer'}
      title="Treasurer"
      name="Adhi Thirumala"
      img={treasurer}
    />,
    <LeadershipCard
      key={'secretary'}
      title="Secretary"
      name="Krish Gangal"
      img={secretary}
      email="mailto:kgangal2@illinois.edu"
    />

  ]
  return (
    <section id="leadership" className="container flex flex-col">
      <h1>Leadership</h1>
      <div className="mb-8">
        Email the leadership team at{' '}
        <Link
          href="mailto:officers@acm.illinois.edu"
          className="text-primary hover:text-secondary"
        >
          officers@acm.illinois.edu
        </Link>
        .
      </div>
      <div className={`grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`}>
        {cards}
      </div>
    </section>
  );
}
