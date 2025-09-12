'use client';

const MembershipOptions = () => {
  return (
    <>
      <div className="bg-primary-300 min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6">
        <h1 className="text-white text-4xl font-bold mb-4 text-center">
          Become a Member of ACM@UIUC
        </h1>

        <p className="text-gray-300 text-center max-w-3xl mx-auto">
          Becoming a paid member unlocks exclusive benefits like our resume book, Latea discount, discounts on events, free printing, and more!
          <a
            href="https://go.acm.illinois.edu/paid-member-guide"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-white underline hover:text-secondary transition-colors ml-1"
          >
            See the full list in our Paid Member Guide.
          </a>
        </p>

        <div className="max-md:my-8 lg:my-10 w-full max-w-6xl text-center">
          <a
            href="/check-membership"
            className="block w-full sm:w-fit mx-auto px-16 py-3 text-white text-center text-xl rounded-full bg-blush-400 hover:bg-blush-600 transition-all"
          >
            Already a member? Get your verification pass here!
          </a>
        </div>

        <div className="max-w-6xl w-full flex flex-col md:flex-row gap-8 justify-center">
          <div className="flex-1 bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center justify-center min-h-[300px]">
            <h2 className="text-2xl font-semibold mb-4">1. Join Discord</h2>
            <p className="mb-6">
              Connect with our community on Discord for real‑time discussions
              and updates.
            </p>
            <a
              className="flex flex-col w-full sm:w-fit px-16 py-3 items-center text-white text-center text-xl rounded-full bg-atomic_tangerine-400 hover:bg-atomic_tangerine-600 transition-all"
              href="https://discord.gg/w8kX7YgD3F"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Discord
            </a>
          </div>

          <div className="flex-1 bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center justify-center min-h-[300px]">
            <h2 className="text-2xl font-semibold mb-4">
              2. Become a Paid Member
            </h2>
            <p className="mb-6">
              Get more involved and support ACM by becoming a paid member. Enjoy
              exclusive benefits and member-only resources!
            </p>
            <a
              className="flex flex-col w-full sm:w-fit px-16 py-3 items-center text-white text-center text-xl rounded-full bg-atomic_tangerine-400 hover:bg-atomic_tangerine-600 transition-all"
              href="/membership"
              target="_blank"
              rel="noopener noreferrer"
            >
              Become a Member
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default MembershipOptions;
