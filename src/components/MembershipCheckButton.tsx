import { useState } from 'react';
import { IdCard } from 'lucide-react';
import { membershipApiClient } from '../api/index.js';
import AuthActionButton from './AuthActionButton.tsx';
import MembershipStatusPopup, {
  type MembershipStatus,
} from './MembershipStatusPopup.tsx';
import { handleResponseError } from '../util.ts';

interface Props {
  class?: string;
}

export default function MembershipCheckButton({ class: className }: Props) {
  const [status, setStatus] = useState<MembershipStatus | null>(null);

  return (
    <>
      <MembershipStatusPopup status={status} onClose={() => setStatus(null)} />
      <AuthActionButton
        class={className}
        icon={IdCard}
        defaultText="Check Membership"
        workingText="Checking..."
        onAction={async (accessToken, showError) => {
          try {
            const response = await membershipApiClient.apiV1MembershipGet({
              xUiucToken: accessToken,
            });
            setStatus({ ...response, accessToken });
          } catch (e) {
            await handleResponseError(
              e,
              showError,
              500,
              'An error occurred checking your membership.',
            );
          }
        }}
      />
    </>
  );
}
