import { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { initMsalClient, loginRequest } from '../authConfig';
import type { IPublicClientApplication, PopupRequest } from '@azure/msal-browser';
import { membershipApiClient } from "../api/index.js"
import ErrorPopup, { useErrorPopup } from "./ErrorPopup.tsx"
import { ResponseError } from '@acm-uiuc/core-client';
import MembershipStatusPopup, { type MembershipStatus } from './MembershipStatusPopup';

interface Props {
  class?: string;
}

const PurchaseButtonContent = ({ class: className }: Props) => {
  const { error, showError, clearError } = useErrorPopup();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [pca, setPca] = useState<IPublicClientApplication>();
  const [status, setStatus] = useState<MembershipStatus | null>(null);

  useEffect(() => {
    initMsalClient().then(setPca);
  }, [])

  const handlePurchase = async () => {
    if (!pca) {
      return;
    }
    setIsPurchasing(true);

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
        const response = await membershipApiClient.apiV2MembershipCheckoutGet({ xUiucToken });
        window.location.href = response;
      } catch (e) {
        if (e instanceof ResponseError && e.response) {
          const response = await e.response.json() as { message?: string, id?: number };
          if (response.message && response.message.includes("is already a paid member")) {
            const memberInfo = await membershipApiClient.apiV1MembershipGet({ xUiucToken });
            setStatus({ ...memberInfo, accessToken: xUiucToken });
          } else {
            console.error(e);
            showError(response.id || 500, response.message || "An error ocurred creating your checkout session.")
          }
        } else {
          console.error(e);
          showError(500, "An error ocurred creating your checkout session.")
        }
      }
    } catch (e) {
      console.error("Authentication or token acquisition failed:", e);
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className={`text-center ${className || ''}`}>
      <ErrorPopup error={error} onClose={clearError} />
      <MembershipStatusPopup status={status} onClose={() => setStatus(null)} />
      <button
        onClick={handlePurchase}
        disabled={isPurchasing}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-tangerine-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-tangerine-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ShoppingCart className="h-5 w-5" />
        {isPurchasing ? "Loading..." : "Purchase Membership"}

      </button>
    </div>
  );
};

export default function MembershipPurchaseButton(props: Props) {
  return (
    <PurchaseButtonContent {...props} />
  );
}
