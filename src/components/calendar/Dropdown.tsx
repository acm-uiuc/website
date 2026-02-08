import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'preact/hooks';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  class?: string;
}

export default function Dropdown({
  value,
  options,
  onChange,
  placeholder,
  class: className = '',
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find((o) => o.value === value);
  const label = selected?.label ?? placeholder ?? 'Select...';

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors hover:border-navy-300 focus:border-navy-500 focus:outline-none"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {label}
        </span>
        <ChevronDown
          size={14}
          class={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {placeholder && (
            <li>
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setOpen(false);
                }}
                className={`w-full px-3 py-1.5 text-left text-sm transition-colors hover:bg-navy-50 ${
                  !value ? 'font-medium text-navy-700' : 'text-gray-500'
                }`}
              >
                {placeholder}
              </button>
            </li>
          )}
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full px-3 py-1.5 text-left text-sm transition-colors hover:bg-navy-50 ${
                  opt.value === value
                    ? 'bg-navy-50 font-medium text-navy-700'
                    : 'text-gray-700'
                }`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
