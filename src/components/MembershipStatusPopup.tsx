import { useState, useEffect, useRef } from 'preact/hooks';
import { X, CircleCheck, CircleX, Wallet, Loader2 } from 'lucide-react';
import { mobileWalletApiClient } from '../api/index.js';

export interface MembershipStatus {
  isPaidMember: boolean;
  netId: string;
  givenName?: string | null;
  surname?: string | null;
  accessToken: string;
}

interface MembershipStatusPopupProps {
  status: MembershipStatus | null;
  onClose: () => void;
}

export default function MembershipStatusPopup({
  status,
  onClose,
}: MembershipStatusPopupProps) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isWalletLoading, setIsWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const lastStatusRef = useRef<MembershipStatus | null>(null);

  if (status) {
    lastStatusRef.current = status;
  }

  useEffect(() => {
    if (status) {
      setMounted(true);
      setCurrentTime(new Date());
      setWalletError(null);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      timeoutRef.current = setTimeout(() => {
        setMounted(false);
        lastStatusRef.current = null;
      }, 200);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [status]);

  useEffect(() => {
    if (!status) return;
    const intervalId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, [status]);

  const internalOnClose = () => {
    setVisible(false);
    onClose();
  }

  const handleAddToWallet = async () => {
    if (!status?.accessToken) return;
    setIsWalletLoading(true);
    setWalletError(null);
    try {
      const response = await mobileWalletApiClient.apiV2MobileWalletMembershipGet({
        xUiucToken: status.accessToken,
      });
      const url = window.URL.createObjectURL(response);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'acm_uiuc_membership.pkpass');
      document.body.appendChild(link);
      link.click();
      link.parentNode!.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      setWalletError('Failed to generate wallet pass. Please try again.');
    } finally {
      setIsWalletLoading(false);
    }
  };

  if (!mounted) return null;

  // Use the snapshot so content doesn't change during exit animation
  const displayStatus = lastStatusRef.current;
  const isPaid = displayStatus?.isPaidMember;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={internalOnClose}
      />
      <div
        className={`relative z-10 mx-4 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-200 ${visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      >
        {/* Header */}
        <div
          className={`px-8 pt-8 pb-6 ${isPaid ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-gray-400 to-gray-500'}`}
        >
          <button
            onClick={internalOnClose}
            className="absolute top-3 right-3 rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex flex-col items-center text-center text-white">
            {isPaid ? (
              <CircleCheck className="mb-3 h-16 w-16" />
            ) : (
              <CircleX className="mb-3 h-16 w-16" />
            )}
            <h3 className="text-2xl font-extrabold">
              {isPaid
                ? "You're a Paid Member!"
                : "You're not a Paid Member"}
            </h3>
            {isPaid && displayStatus?.givenName && displayStatus?.surname && (
              <p className="mt-2 text-2xl font-semibold text-white/90">
                {displayStatus.givenName} {displayStatus.surname}
              </p>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col items-center px-8 pt-6 pb-8 text-center">
          {isPaid ? (
            <>
              <p className="text-md text-navy-800">
                {displayStatus?.netId}@illinois.edu
              </p>
              <p className="mt-1 text-sm text-gray-400">
                {currentTime.toLocaleString()}
              </p>

              <div className="my-5 w-full border-t border-gray-200" />

              <button
                onClick={handleAddToWallet}
                disabled={isWalletLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isWalletLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating pass...
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4" />
                    Add to Mobile Wallet
                  </>
                )}
              </button>
              {walletError && (
                <p className="mt-2 text-xs text-red-500">{walletError}</p>
              )}

              <button
                onClick={internalOnClose}
                className="mt-3 w-full rounded-lg px-4 py-2 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-100"
              >
                Done
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600">
                Purchase an ACM @ UIUC membership to unlock exclusive perks
                like swipe access, free printing, and priority event access.
              </p>
              <a
                href="/membership"
                className="mt-5 inline-block w-full rounded-lg bg-tangerine-500 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-tangerine-600"
              >
                Purchase Membership
              </a>
              <button
                onClick={internalOnClose}
                className="mt-2 w-full rounded-lg px-4 py-2 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-100"
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
