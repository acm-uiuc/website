import NextImage, { StaticImageData } from 'next/image';
import { BsEnvelope } from 'react-icons/bs';

interface LeadershipCardProps {
  title: string;
  name: string;
  img?: StaticImageData;
  email?: string;
}

export default function LeadershipCard({
  title,
  name,
  img,
  email,
}: LeadershipCardProps) {
  return (
    <div className="flex flex-col items-center text-center">
      {img ? (
        <NextImage
          className="aspect-square w-full max-w-64 max-h-64 object-cover rounded-full mb-2"
          src={img}
          alt={name}
        />
      ) : null}
      <p className="text-3xl text-primary font-bold">{title}</p>
      <p className="text-xl">{name}</p>
    </div>
  );
}
