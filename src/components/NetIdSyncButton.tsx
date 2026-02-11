import { CircleCheck, RefreshCcw } from 'lucide-react';
import { useState } from 'react';

import { genericApiClient } from '../api/index.js';
import { handleResponseError } from '../util.ts';
import AuthActionButton from './AuthActionButton.tsx';
import NoticePopup from './NoticePopup.tsx';

export default function NetIdSyncButton() {
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <>
      <NoticePopup open={showSuccess} onClose={() => setShowSuccess(false)}>
        <div className="flex flex-col items-center p-8 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CircleCheck className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-navy-900">
            Identity Synced
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Your Illinois NetID has been synced with your ACM account.
          </p>
          <button
            onClick={() => setShowSuccess(false)}
            className="mt-5 w-full rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
          >
            Done
          </button>
        </div>
      </NoticePopup>
      <AuthActionButton
        icon={RefreshCcw}
        defaultText="Sync Identity"
        workingText="Syncing..."
        returnPath="/admin/sync?authButtonClick"
        onAction={async (accessToken, showError) => {
          try {
            await genericApiClient.apiV1SyncIdentityPostRaw({
              xUiucToken: accessToken,
            });
            setShowSuccess(true);
          } catch (e) {
            await handleResponseError(
              e,
              showError,
              500,
              'An error occurred syncing your identity.'
            );
          }
        }}
      />
    </>
  );
}
