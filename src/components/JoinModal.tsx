import { SiDiscord } from '@icons-pack/react-simple-icons';
import { LucideArrowRight } from 'lucide-react';
import { useEffect, useState } from 'preact/hooks';

interface Props {
  discordUrl: string;
  membershipUrl: string;
}

const JoinModal = ({ discordUrl, membershipUrl }: Props) => {
  const [isOpen, setIsOpen] = useState(true);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    window.history.back();
  };

  const handleDiscordClick = () => {
    window.open(discordUrl, '_blank');
    setStep(2);
  };

  const handleMembershipClick = () => {
    window.open(membershipUrl);
    handleClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        class="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div class="relative z-10 mx-4 w-full max-w-lg rounded-2xl bg-white p-10 shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleClose}
          class="absolute top-4 right-4 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="Close modal"
        >
          <svg
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header */}
        <div class="mb-6 text-center">
          <h2 class="text-2xl font-bold text-navy-900">Join ACM @ UIUC</h2>
          <p class="mt-2 text-gray-600">
            Complete these steps to become a member
          </p>
        </div>

        {/* Progress indicator */}
        <div class="mb-8 flex items-center justify-center gap-3">
          <div
            class={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
              step >= 1
                ? 'bg-tangerine-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {step > 1 ? (
              <svg
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              '1'
            )}
          </div>
          <div
            class={`h-1 w-12 rounded-full ${step >= 2 ? 'bg-tangerine-500' : 'bg-gray-200'}`}
          />
          <div
            class={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
              step >= 2
                ? 'bg-tangerine-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            2
          </div>
        </div>

        {/* Steps */}
        <div class="space-y-4">
          {/* Step 1: Discord */}
          <div
            class={`rounded-xl border-2 p-5 transition-all ${
              step === 1
                ? 'border-tangerine-500 bg-tangerine-50'
                : step > 1
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200'
            }`}
          >
            <div class="flex items-start gap-4">
              <div
                class={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                  step > 1 ? 'bg-green-500' : 'bg-indigo-600'
                }`}
              >
                {step > 1 ? (
                  <svg
                    class="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    class="h-5 w-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <SiDiscord />
                  </svg>
                )}
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-navy-900">Join our Discord</h3>
                <p class="mt-1 text-sm text-gray-600">
                  Connect with the community and stay updated on events
                </p>
                {step === 1 && (
                  <div class="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleDiscordClick}
                      class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                    >
                      Join Discord
                      <svg
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <LucideArrowRight />
                      </svg>
                    </button>
                    <button
                      onClick={() => setStep(2)}
                      class="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-300"
                    >
                      Already joined? Skip
                    </button>
                  </div>
                )}
                {step > 1 && (
                  <span class="mt-3 inline-flex items-center gap-1 text-sm font-medium text-green-600">
                    <svg
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Completed
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Step 2: Membership */}
          <div
            class={`rounded-xl border-2 p-5 transition-all ${
              step === 2
                ? 'border-tangerine-500 bg-tangerine-50'
                : 'border-gray-200'
            }`}
          >
            <div class="flex items-start gap-4">
              <div
                class={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                  step >= 2 ? 'bg-tangerine-500' : 'bg-gray-300'
                }`}
              >
                <svg
                  class="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div class="flex-1">
                <h3
                  class={`font-semibold ${step >= 2 ? 'text-navy-900' : 'text-gray-400'}`}
                >
                  Become a Paid Member
                </h3>
                <p
                  class={`mt-1 text-sm ${step >= 2 ? 'text-gray-600' : 'text-gray-400'}`}
                >
                  Register to get access to exclusive events and opportunities
                </p>
                {step === 2 && (
                  <button
                    onClick={handleMembershipClick}
                    class="mt-3 inline-flex items-center gap-2 rounded-lg bg-tangerine-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-tangerine-600"
                  >
                    Become a Paid Member
                    <svg
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <LucideArrowRight />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinModal;
