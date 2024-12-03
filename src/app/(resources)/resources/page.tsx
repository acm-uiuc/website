// import React from 'react';

// const Resources = () => {
//   return (
//     <div>
//     <h1>ACM Paid Member Guide</h1>
//     <p>
//       If you’re here to learn how to pay for membership and access all the benefits, you’re in the right place! Swipe access, resume book, free printing, and discounted events are all at your fingertips!
//     </p>
//     <p>
//       You do <strong>NOT</strong> need to pay to participate in all of our SIGs, Committees, and most of our Social events.
//     </p>

//     <h2>Membership Payment</h2>
//     <p>
//       Click <a href="https://www.acm.illinois.edu/membership" target="_blank" rel="noopener noreferrer">here</a> to pay for your membership online. You’ll need to pay with a credit or debit card.
//     </p>
//     <p>Congrats! You’re a paid member now!</p>

//     <h2>Swipe Access Form</h2>
//     <p>
//       To obtain swipe access for the ACM room, you’ll need to fill out the ACM Swipe Form. Click <a href="https://forms.gle/5eGXEMFgfHDcoWzD9" target="_blank" rel="noopener noreferrer">here</a> to fill out the form. More info, including any FAQ, can be found on the form.
//     </p>

//     <h2>Resume Book</h2>
//     <p>
//       Click <a href="https://resumes.acm.illinois.edu/" target="_blank" rel="noopener noreferrer">here</a> to sign into Resume Book. Upload your resume, and update your profile! The more detail, the more likely your resume is seen by a recruiter!
//     </p>

//     <h2>Free Printing</h2>
//     <p>The ACM printer is in the middle room! Connect and print, for paid members ONLY.</p>

//     <h2>Discounted Events</h2>
//     <p>
//       Automatically done! Your discount will be automatically applied at checkout for events such as semi-formal!
//     </p>

//     <h2>Discounted Latea</h2>
//     <p>
//       ACM is partnering with Latea, so every paid member now has a 10% discount at Latea (non-stackable)! At the counter, go to{' '}
//       <a href="https://membership.acm.illinois.edu" target="_blank" rel="noopener noreferrer">membership.acm.illinois.edu</a> and enter your NetID to get confirmation that you are a paid member and enjoy your sweet treat!
//     </p>
//   </div>
//   );
// };
import Link from 'next/link';
import ExtLink from '@/components/Link';
import Transition from '@/components/Transition';

const Resources = () => {
  return (
    <>
      <div className="h-5 bg-acmdark flex" />
      <Transition bgClass="bg-surface-000" />
      <div className="flex flex-col gap-8 bg-surface-000 pt-6 pb-24">
        <section id="resources" className="container flex flex-col gap-4">
          <h1>ACM Paid Member Guide</h1>
          <p>
            If you’re here to learn how to pay for membership and access all the benefits, you’re in the right place! Swipe access, resume book, free printing, and discounted events are all at your fingertips!
          </p>
          <p>
            You do <strong>NOT</strong> need to pay to participate in all of our SIGs, Committees, and most of our Social events.
          </p>

          <h2>Membership Payment</h2>
          <p>
            Click <ExtLink href="https://www.acm.illinois.edu/membership">here</ExtLink> to pay for your membership online. You’ll need to pay with a credit or debit card.
          </p>
          <p>Congrats! You’re a paid member now!</p>

          <h2>Swipe Access Form</h2>
          <p>
            To obtain swipe access for the ACM room, you’ll need to fill out the ACM Swipe Form. Click <ExtLink href="https://forms.gle/5eGXEMFgfHDcoWzD9">here</ExtLink> to fill out the form. More info, including any FAQ, can be found on the form.
          </p>

          <h2>Resume Book</h2>
          <p>
            Click <ExtLink href="https://resumes.acm.illinois.edu/">here</ExtLink> to sign into Resume Book. Upload your resume, and update your profile! The more detail, the more likely your resume is seen by a recruiter!
          </p>

          <h2>Free Printing</h2>
          <p>The ACM printer is in the middle room! Connect and print, for paid members ONLY.</p>

          <h2>Discounted Events</h2>
          <p>
            Automatically done! Your discount will be automatically applied at checkout for events such as semi-formal!
          </p>

          <h2>Discounted Latea</h2>
          <p>
            ACM is partnering with Latea, so every paid member now has a 10% discount at Latea (non-stackable)! At the counter, go to{' '}
            <ExtLink href="https://membership.acm.illinois.edu">membership.acm.illinois.edu</ExtLink> and enter your NetID to get confirmation that you are a paid member and enjoy your sweet treat!
          </p>
        </section>
      </div>
    </>
  );
};

export default Resources;