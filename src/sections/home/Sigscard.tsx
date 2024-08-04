'use client';
import Card from '@/components/Card/Card';
import { AllSigData } from '@/sections/home/SigData';



export default function Sigscard() {
  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {AllSigData.map(({ title, description, link1, linktext1, linktext2, link2, linktext3, link3 }) => (
        <Card
          key={title}
          title={title}
          description={description}
          link1={link1}
          link2={link2}
          linktext1={linktext1}
          linktext2={linktext2}
          link3={link3}
          linktext3={linktext3}
        /> 
      ))}
    </div>
  );
};
