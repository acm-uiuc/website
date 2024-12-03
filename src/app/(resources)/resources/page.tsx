import Link from 'next/link';
import ExtLink from '@/components/Link';
import Transition from '@/components/Transition';

const Resources = () => {
  return (
    <>
      <div className="h-5 bg-acmdark flex" />
      <Transition bgClass="bg-surface-000" />
      <div className="flex flex-col md:flex-row gap-8 bg-surface-000 pt-6 pb-24">
        {/*table of contents*/}
        <nav className="w-full md:w-1/4">
            <div className="sticky top-6 px-4 pt-6 flex flex-col items-center px-4 mx-auto">
                {/* <h2 className="text-lg font-bold mb-4 text-center">Table of Contents</h2> */}
                <ul className="space-y-2">
                <li>
                    <Link href="#acm-paid-member-guide" className="text-primary hover:text-secondary transition-all">
                    ACM Paid Member Guide
                    </Link>
                </li>
                <li>
                    <Link href="#cs-cares" className="text-primary hover:text-secondary transition-all">
                    CS Cares
                    </Link>
                </li>
                <li>
                    <Link href="#feedback" className="text-primary hover:text-secondary transition-all">
                    Feedback
                    </Link>
                </li>
                </ul>
            </div>
            </nav>

        {/*paid member guide*/}
        <div className="w-full md:w-3/4">
          <section id="acm-paid-member-guide">
            <h1>ACM Paid Member Guide</h1><br />
            <p>
              If you’re here to learn how to pay for membership and access all the benefits, you’re in the right place! Swipe access, resume book, free printing, and discounted events are all at your fingertips!
            </p>
            <p>
              You do <strong>NOT</strong> need to pay to participate in all of our SIGs, Committees, and most of our Social events.
            </p><br />

            <h2>Membership Payment</h2>
            <p>
              Click <ExtLink href="https://www.acm.illinois.edu/membership">here</ExtLink> to pay for your membership online. You’ll need to pay with a credit or debit card.
            </p>
            <p>Congrats! You’re a paid member now!</p><br />

            <h2>Swipe Access Form</h2>
            <p>
              To obtain swipe access for the ACM room, you’ll need to fill out the ACM Swipe Form. Click <ExtLink href="https://forms.gle/5eGXEMFgfHDcoWzD9">here</ExtLink> to fill out the form. More info, including any FAQ, can be found on the form.
            </p><br />

            <h2>Resume Book</h2>
            <p>
              Click <ExtLink href="https://resumes.acm.illinois.edu/">here</ExtLink> to sign into Resume Book. Upload your resume, and update your profile! The more detail, the more likely your resume is seen by a recruiter!
            </p><br />

            <h2>Free Printing</h2>
            <p>The ACM printer is in the middle room! Connect and print, for paid members ONLY.</p><br />

            <h2>Discounted Events</h2>
            <p>
              Automatically done! Your discount will be automatically applied at checkout for events such as semi-formal!
            </p><br />

            <h2>Discounted Latea</h2>
            <p>
              ACM is partnering with Latea, so every paid member now has a 10% discount at Latea (non-stackable)! At the counter, go to{' '}
              <ExtLink href="https://membership.acm.illinois.edu">membership.acm.illinois.edu</ExtLink> and enter your NetID to get confirmation that you are a paid member and enjoy your sweet treat! <br />
            </p>
          </section><br /><br />
        {/*cs-cares stuff*/}
          <section id="cs-cares">
            <h1>CS Cares</h1>
            <p><ExtLink href="https://siebelschool.illinois.edu/about/cs-cares">CS Cares</ExtLink></p>
          </section><br /><br />
        {/*feedback*/}
          <section id="feedback">
            <h1>Feedback</h1>
            <p><ExtLink href="https://go.acm.illinois.edu/feedback">Feedback</ExtLink></p>
          </section>
        </div>
      </div>
    </>
  );
};

export default Resources;
