import { CircleAlert } from 'lucide-react';
import { useCallback, useState } from 'preact/hooks';

import NoticePopup from './NoticePopup.tsx';

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
  return (
    <NoticePopup open={Boolean(error)} onClose={onClose}>
      <div className="flex flex-col items-center p-6 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <CircleAlert className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-navy-900">
          Error {error?.code}
        </h3>
        <p className="mt-2 mb-4 text-md text-gray-700">{error?.message}</p>
        <p className="mt-2 mb-4 text-sm text-gray-600">
          For additional help, please contact infra@acm.illinois.edu.
        </p>
        <button
          onClick={onClose}
          className="mt-5 w-full rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
        >
          Dismiss
        </button>
      </div>
    </NoticePopup>
  );
}
