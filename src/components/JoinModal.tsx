import { SiDiscord } from '@icons-pack/react-simple-icons';
import { LucideArrowRight } from 'lucide-react';
import { useEffect, useState } from 'preact/hooks';

interface Props {
  discordUrl: string;
  membershipUrl: string;
  onClose: () => void;
}

const JoinModal = ({ discordUrl, membershipUrl, onClose }: Props) => {
  const [step, setStep] = useState(1);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleDiscordClick = () => {
    window.open(discordUrl, '_blank');
    setStep(2);
  };

  const handleMembershipClick = () => {
    window.open(membershipUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 mx-4 w-full max-w-lg rounded-2xl bg-white p-10 shadow-2xl animate-[popIn_200ms_ease-out]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="Close modal"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-navy-900">Join ACM @ UIUC</h2>
          <p className="mt-2 text-gray-600">
            Complete these steps to become a member
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
              step >= 1
                ? 'bg-tangerine-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {step > 1 ? (
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              '1'
            )}
          </div>
          <div
            className={`h-1 w-12 rounded-full ${step >= 2 ? 'bg-tangerine-500' : 'bg-gray-200'}`}
          />
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
              step >= 2
                ? 'bg-tangerine-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            2
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {/* Step 1: Discord */}
          <div
            className={`rounded-xl border-2 p-5 transition-all ${
              step === 1
                ? 'border-tangerine-500 bg-tangerine-50'
                : step > 1
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                  step > 1 ? 'bg-green-500' : 'bg-indigo-600'
                }`}
              >
                {step > 1 ? (
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <SiDiscord />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-navy-900">
                  Join our Discord
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Connect with the community and stay updated on events
                </p>
                {step === 1 && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleDiscordClick}
                      className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                    >
                      Join Discord
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <LucideArrowRight />
                      </svg>
                    </button>
                    <button
                      onClick={() => setStep(2)}
                      className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-300"
                    >
                      Already joined? Skip
                    </button>
                  </div>
                )}
                {step > 1 && (
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-green-600">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
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
            className={`rounded-xl border-2 p-5 transition-all ${
              step === 2
                ? 'border-tangerine-500 bg-tangerine-50'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                  step >= 2 ? 'bg-tangerine-600' : 'bg-gray-300'
                }`}
              >
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3
                  className={`font-semibold ${step >= 2 ? 'text-navy-900' : 'text-gray-400'}`}
                >
                  Become a Paid Member
                </h3>
                <p
                  className={`mt-1 text-sm ${step >= 2 ? 'text-gray-600' : 'text-gray-400'}`}
                >
                  Register to get access to exclusive events and opportunities
                </p>
                {step === 2 && (
                  <button
                    onClick={handleMembershipClick}
                    className="mt-3 inline-flex items-center gap-2 rounded-lg bg-tangerine-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-tangerine-600"
                  >
                    Become a Paid Member
                    <svg
                      className="h-4 w-4"
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
