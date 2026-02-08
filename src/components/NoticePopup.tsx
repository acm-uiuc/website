import { X } from 'lucide-react';
import type { ComponentChildren } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';

interface NoticePopupProps {
  open: boolean;
  onClose: () => void;
  children: ComponentChildren;
  maxWidth?: string;
  closeColor?: string;
}

export default function NoticePopup({
  open,
  onClose,
  children,
  maxWidth = 'max-w-sm',
  closeColor,
}: NoticePopupProps) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      timeoutRef.current = setTimeout(() => setMounted(false), 200);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [open]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <div
        className={`relative z-10 mx-4 w-full ${maxWidth} overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-200 ${visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      >
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 z-10 rounded-lg p-1.5 ${closeColor || 'text-gray-400'} transition-colors hover:bg-white/20 hover:text-gray-600`}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
}
