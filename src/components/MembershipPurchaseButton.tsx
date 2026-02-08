import { ResponseError } from '@acm-uiuc/core-client';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

import { membershipApiClient } from '../api/index.js';
import AuthActionButton from './AuthActionButton.tsx';
import MembershipStatusPopup, {
  type MembershipStatus,
} from './MembershipStatusPopup.tsx';

interface Props {
  class?: string;
}

export default function MembershipPurchaseButton({ class: className }: Props) {
  const [status, setStatus] = useState<MembershipStatus | null>(null);

  return (
    <>
      <MembershipStatusPopup status={status} onClose={() => setStatus(null)} />
      <AuthActionButton
        class={className}
        icon={ShoppingCart}
        defaultText="Purchase Membership"
        workingText="Loading..."
        onAction={async (accessToken, showError) => {
          try {
            const checkoutUrl =
              await membershipApiClient.apiV2MembershipCheckoutGet({
                xUiucToken: accessToken,
                force: true,
              });
            window.location.href = checkoutUrl;
          } catch (e) {
            if (e instanceof ResponseError && e.response) {
              const body = (await e.response.json()) as {
                message?: string;
                id?: number;
              };
              if (body.message?.includes('is already a paid member')) {
                const memberInfo = await membershipApiClient.apiV1MembershipGet(
                  { xUiucToken: accessToken }
                );
                setStatus({ ...memberInfo, accessToken });
              } else {
                showError(
                  body.id || 500,
                  body.message ||
                    'An error occurred creating your checkout session.'
                );
              }
            } else {
              showError(
                500,
                'An error occurred creating your checkout session.'
              );
            }
          }
        }}
      />
    </>
  );
}
