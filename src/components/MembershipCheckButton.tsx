import { useEffect, useState } from 'react';
import { IdCard } from 'lucide-react';
import { initMsalClient, loginRequest } from '../authConfig';
import type { IPublicClientApplication, PopupRequest } from '@azure/msal-browser';
import { membershipApiClient } from "../api/index.js"
import ErrorPopup, { useErrorPopup } from "./ErrorPopup.tsx"
import { ResponseError } from '@acm-uiuc/core-client';
import MembershipStatusPopup, { type MembershipStatus } from './MembershipStatusPopup';
import { handleResponseError } from '../util.ts';

interface Props {
  class?: string;
}

const CheckButtonContent = ({ class: className }: Props) => {
  const { error, showError, clearError } = useErrorPopup();
  const [isChecking, setIsChecking] = useState(false);
  const [pca, setPca] = useState<IPublicClientApplication>();
  const [status, setStatus] = useState<MembershipStatus | null>(null);

  useEffect(() => {
    initMsalClient().then(setPca);
  }, [])

  const handleMembershipCheck = async () => {
    if (!pca) {
      return;
    }
    setIsChecking(true);

    try {
      const account = pca.getActiveAccount() || pca.getAllAccounts()[0];

      const request: PopupRequest = {
        ...loginRequest,
        account: account || undefined,
        redirectUri: '/auth-redirect'
      };

      let response;
      if (!account) {
        response = await pca.loginPopup(request);
      } else {
        try {
          response = await pca.acquireTokenSilent(request);
        } catch (e) {
          response = await pca.acquireTokenPopup(request);
        }
      }

      const xUiucToken = response.accessToken;
      try {
        const response = await membershipApiClient.apiV1MembershipGet({ xUiucToken });
        setStatus({ ...response, accessToken: xUiucToken });
      } catch (e) {
        await handleResponseError(e, showError, 500, "An error ocurred checking your membership.");
      }
    } catch (e) {
      console.error("Authentication or token acquisition failed:", e);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className={`text-center ${className || ''}`}>
      <ErrorPopup error={error} onClose={clearError} />
      <MembershipStatusPopup status={status} onClose={() => setStatus(null)} />
      <button
        onClick={handleMembershipCheck}
        disabled={isChecking}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-tangerine-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-tangerine-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
      >
        <IdCard className="h-5 w-5" />
        {isChecking ? "Loading..." : "Check Membership"}

      </button>
    </div>
  );
};

export default function MembershipCheckButton(props: Props) {
  return (
    <CheckButtonContent {...props} />
  );
}
