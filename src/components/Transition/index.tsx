interface TransitionProps {
  to?: string;
  bgClass?: string;
};

export default function Transition({ to, bgClass }: TransitionProps) {
  return (
    <div className={`rounded-t-3xl w-full -mt-5 h-5 ${bgClass ?? ""}`} style={to ? {backgroundColor: to} : undefined} />
  );
}