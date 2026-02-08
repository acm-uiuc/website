import { CircleCheck, CircleX, Wallet } from 'lucide-react';
import { useEffect, useRef, useState } from 'preact/hooks';
import QRCode_ from 'react-qrcode-logo';

import { mobileWalletApiClient } from '../api/index.js';
import { handleResponseError } from '../util.ts';
import AuthActionButton from './AuthActionButton.tsx';
import NoticePopup from './NoticePopup.tsx';

const QRCode = QRCode_ as any;

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
  const [currentTime, setCurrentTime] = useState(new Date());
  const lastStatusRef = useRef<MembershipStatus | null>(null);

  if (status) {
    lastStatusRef.current = status;
  }

  useEffect(() => {
    if (status) {
      setCurrentTime(new Date());
    }
  }, [status]);

  useEffect(() => {
    if (!status) {
      return;
    }
    const intervalId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, [status]);

  const displayStatus = lastStatusRef.current;
  const isPaid = displayStatus?.isPaidMember;

  return (
    <NoticePopup
      open={Boolean(status)}
      onClose={onClose}
      maxWidth="max-w-md"
      closeColor="text-white"
    >
      {/* Header */}
      <div
        className={`px-8 pt-8 pb-6 ${isPaid ? 'bg-gradient-to-br from-teal-200 to-green-700' : 'bg-gradient-to-br from-gray-400 to-gray-500'}`}
      >
        <div className="flex flex-col items-center text-center text-white">
          {isPaid ? (
            <CircleCheck className="mb-3 h-16 w-16" />
          ) : (
            <CircleX className="mb-3 h-16 w-16" />
          )}
          <h3 className="text-2xl font-extrabold">
            {isPaid ? "You're a Paid Member!" : "You're not a Paid Member"}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col items-center px-8 pt-6 pb-8 text-center">
        {isPaid ? (
          displayStatus.netId && (
            <>
              <QRCode value={displayStatus.netId} />
              {displayStatus.givenName && displayStatus.surname && (
                <p className="text-lg text-navy-800">
                  {displayStatus.givenName} {displayStatus.surname}
                </p>
              )}
              <p className="text-md text-navy-800">{displayStatus.netId}</p>
              <p className="mt-1 text-sm text-gray-400">
                {currentTime.toLocaleString()}
              </p>

              <div className="my-5 w-full border-t border-gray-200" />

              <AuthActionButton
                icon={Wallet}
                defaultText="Add to Mobile Wallet"
                workingText="Adding..."
                bgColorClass="bg-navy-600 hover:bg-navy-700"
                class="w-full"
                onAction={async (accessToken, showError) => {
                  try {
                    const response =
                      await mobileWalletApiClient.apiV2MobileWalletMembershipGet(
                        { xUiucToken: accessToken }
                      );
                    const url = window.URL.createObjectURL(response);
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'acm_uiuc_membership.pkpass');
                    document.body.appendChild(link);
                    link.click();
                    link.parentNode!.removeChild(link);
                    window.URL.revokeObjectURL(url);
                  } catch (e) {
                    await handleResponseError(
                      e,
                      showError,
                      500,
                      'An error occurred generating your wallet pass.'
                    );
                  }
                }}
              />
              <button
                onClick={onClose}
                className="mt-3 w-full rounded-lg px-4 py-2 text-sm font-semibold text-gray-500 transition-colors bg-gray-200 hover:bg-gray-300"
              >
                Done
              </button>
            </>
          )
        ) : (
          <>
            <p className="text-sm text-gray-600">
              Purchase an ACM @ UIUC membership to unlock exclusive perks like
              swipe access, free printing, and priority event access.
            </p>
            <a
              href="/membership"
              className="mt-5 inline-block w-full rounded-lg bg-tangerine-600 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-tangerine-700"
            >
              Purchase Membership
            </a>
            <button
              onClick={onClose}
              className="mt-2 w-full rounded-lg px-4 py-2 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-100"
            >
              Close
            </button>
          </>
        )}
      </div>
    </NoticePopup>
  );
}
