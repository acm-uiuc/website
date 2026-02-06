import { useState, useCallback, useEffect, useRef } from 'preact/hooks';
import { CircleAlert, X } from 'lucide-react';

export interface ErrorInfo {
  code: string | number;
  message: string;
}

export function useErrorPopup() {
  const [error, setError] = useState<ErrorInfo | null>(null);

  const showError = useCallback((code: string | number, message: string) => {
    setError({ code, message });
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { error, showError, clearError };
}

interface ErrorPopupProps {
  error: ErrorInfo | null;
  onClose: () => void;
}

export default function ErrorPopup({ error, onClose }: ErrorPopupProps) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const lastErrorRef = useRef<ErrorInfo | null>(null);

  if (error) {
    lastErrorRef.current = error;
  }

  useEffect(() => {
    if (error) {
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      timeoutRef.current = setTimeout(() => {
        setMounted(false);
        lastErrorRef.current = null;
      }, 200);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [error]);

  if (!mounted) return null;

  const displayError = lastErrorRef.current;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <div
        className={`relative z-10 mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl transition-all duration-200 ${visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <CircleAlert className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-navy-900">Error {displayError?.code}</h3>
          <p className="mt-2 mb-4 text-md text-gray-700">{displayError?.message}</p>
          <p className="mt-2 mb-4 text-sm text-gray-600">For additional help, please contact infra@acm.illinois.edu.</p>
          <button
            onClick={onClose}
            className="mt-5 w-full rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
