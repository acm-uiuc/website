import Link from 'next/link';
import ExtLink from '@/components/Link';
import Transition from '@/components/Transition';
import config from "@/config.json"

const Resources = () => {
  return (
    <>
      <div className="h-5 bg-acmdark flex" />
      <Transition bgClass="bg-surface-000" />
      <div className="flex flex-col md:flex-row bg-surface-000 pt-6 pb-24">
        {/*table of contents*/}
        <nav className="w-full md:w-72">
          <div className="sticky top-6 flex flex-col items-center mx-auto">
            <h1 className="text-4xl font-bold mb-8">Resources</h1>
            <div className="space-y-4">
              <Link
                href="#acm-paid-member-guide"
                className="block p-4 bg-acmdark hover:bg-secondary text-white rounded-lg shadow-md"
              >
                ACM Paid Member Guide
              </Link>
              <Link
                href="#cs-cares"
                className="block p-4 bg-acmdark hover:bg-secondary text-white rounded-lg shadow-md"
              >
                CS Cares
              </Link>
              <Link
                href="#feedback"
                className="block p-4 bg-acmdark hover:bg-secondary text-white rounded-lg shadow-md"
              >
                Feedback
              </Link>
            </div>
          </div>
        </nav>

        {/*paid member guide*/}
        <div className="bg-surface-000 md:w-5/6">
          <section
            id="acm-paid-member-guide"
            className="p-6 rounded-lg shadow-md"
          >
            <h2 className="text-2xl font-semibold mb-4">
              ACM Paid Member Guide
            </h2>
            <p className="mb-4">
              If you’re here to learn how to pay for membership and access all
              the benefits, you’re in the right place! ACM Room swipe access,
              resume book, free printing, and discounted events are all at your
              fingertips!
            </p>
            <p className="italic mb-6">
              You do <strong>NOT</strong> need to pay to participate in all of
              our SIGs, Committees, and most of our Social events.
            </p>
            <h2 className="text-xl font-semibold mb-4">Become A Member</h2>
            <p className="mb-6">
              Click{' '}
              <ExtLink href="https://www.acm.illinois.edu/membership">
                here
              </ExtLink>{' '}
              to pay for your membership online. Only ${config.membershipPrice} for a lifetime ACM
              membership &rarr; $0 per day! You’ll need to pay with a credit or
              debit card.
            </p>
            <h2 className="text-xl font-semibold mb-4">Perks</h2>
            <ul className="list-disc list-inside">
              <li>
                <h5 className="inline font-bold">Swipe Access Form</h5>
                <p>
                  To obtain swipe access for the ACM room, you’ll need to fill
                  out the ACM Swipe Form. Click{' '}
                  <ExtLink href="https://forms.gle/5eGXEMFgfHDcoWzD9">
                    here
                  </ExtLink>{' '}
                  to fill out the form. More info, including any FAQ, can be
                  found on the form.
                </p>
              </li>
              <li>
                <h5 className="inline font-bold">Resume Book</h5>
                <p>
                  Click{' '}
                  <ExtLink href="https://resumes.acm.illinois.edu/">
                    here
                  </ExtLink>{' '}
                  to sign into Resume Book. Upload your resume and update your
                  profile! The more detail, the more likely your resume is seen
                  by a recruiter!
                </p>
              </li>
              <li>
                <h5 className="inline font-bold">Free Printing</h5>
                <p>
                  The ACM printer is in the middle room! Connect and print, for
                  paid members ONLY.
                </p>
              </li>
              <li>
                <h5 className="inline font-bold">Discounted Events</h5>
                <p>
                  Automatically done! Your discount will be automatically
                  applied at checkout for events such as semi-formal when you
                  use your Illinois email!
                </p>
              </li>
              <li>
                <h5 className="inline font-bold">Discounted Latea</h5>
                <p>
                  ACM is partnering with Latea, so every paid member now has a
                  10% discount (non-stackable) at Latea! At the counter, show
                  the ACM @ UIUC membership pass in your digital wallet. You can
                  also go to{' '}
                  <ExtLink href="https://membership.acm.illinois.edu">
                    our membership page
                  </ExtLink>{' '}
                  and enter your NetID to get confirmation that you are a paid
                  member and enjoy your sweet treat!
                </p>
              </li>
            </ul>
          </section>
          <br />
          <br />

          {/*cs-cares section*/}
          <section id="cs-cares" className="p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">CS Cares</h2>
            <p>
              CS CARES is a confidential resource for students to discuss
              concerns about potential Code of Conduct violations; feel free to
              ask them for guidance or support in addressing any academic
              integrity issues inside and outside of ACM.{' '}
              <ExtLink href="https://siebelschool.illinois.edu/about/cs-cares">
                https://siebelschool.illinois.edu/about/cs-cares
              </ExtLink>
            </p>
          </section>
          <br />
          <br />

          {/*feedback section*/}
          <section id="feedback" className="p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Feedback</h2>
            <p>
              We value your experience and want to create the most supportive
              and inclusive community possible. This anonymous{' '}
              <ExtLink href="https://go.acm.illinois.edu/feedback">
                feedback form
              </ExtLink>{' '}
              is your opportunity to share your thoughts, concerns, or
              suggestions about ACM. We take every submission seriously and will
              ensure confidentiality. Help us create positive changes in our
              community!
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default Resources;
