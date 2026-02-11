import type { IPublicClientApplication } from '@azure/msal-browser';
import type { LucideIcon } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { getUserAccessToken, initMsalClient } from '../authConfig.ts';
import ErrorPopup, { useErrorPopup } from './ErrorPopup.tsx';

export type ShowErrorFunction = (
  code: string | number,
  message: string
) => void;

interface AuthActionButtonProps {
  icon: LucideIcon;
  defaultText: string;
  workingText: string;
  onAction: (
    accessToken: string,
    showError: ShowErrorFunction
  ) => Promise<void>;
  returnPath?: string;
  buttonClassName?: string;
  bgColorClass?: string;
  textColorClass?: string;
  class?: string;
}

export default function AuthActionButton({
  icon: Icon,
  defaultText,
  workingText,
  onAction,
  returnPath,
  buttonClassName,
  bgColorClass = 'bg-tangerine-600 hover:bg-tangerine-700',
  textColorClass = 'text-white',
  class: className,
}: AuthActionButtonProps) {
  const { error, showError, clearError } = useErrorPopup();
  const [isWorking, setIsWorking] = useState(false);
  const [pca, setPca] = useState<IPublicClientApplication>();

  const autoTriggered = useRef(false);

  useEffect(() => {
    initMsalClient().then(setPca).catch(console.error);
  }, []);

  useEffect(() => {
    if (!pca || autoTriggered.current) return;
    const params = new URLSearchParams(window.location.search);
    if (!params.has('authButtonClick')) return;
    autoTriggered.current = true;
    params.delete('authButtonClick');
    const qs = params.toString();
    const newUrl = window.location.pathname + (qs ? `?${qs}` : '');
    window.history.replaceState({}, '', newUrl);
    handleClick();
  }, [pca]);

  const handleClick = async () => {
    if (!pca) {
      return;
    }
    setIsWorking(true);
    try {
      const accessToken = await getUserAccessToken(pca, returnPath);
      await onAction(accessToken, showError);
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <div className={`text-center ${className || ''}`}>
      <ErrorPopup error={error} onClose={clearError} />
      <button
        onClick={handleClick}
        disabled={isWorking}
        className={
          buttonClassName ??
          `inline-flex w-full items-center justify-center gap-2 rounded-lg ${bgColorClass} px-8 py-4 text-lg font-bold ${textColorClass} shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50`
        }
      >
        {isWorking ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            {workingText}
          </>
        ) : (
          <>
            <Icon className="h-5 w-5" />
            {defaultText}
          </>
        )}
      </button>
    </div>
  );
}
