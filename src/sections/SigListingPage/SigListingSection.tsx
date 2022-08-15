import SigListing from "../../stories/SigListing"
import pwny8 from '../../pwny8.svg'

const SigListingSection = () => {
    return (
        <div>
            <h1>Special Interest Groups (SIGs)</h1>
            <p>
                ACM at UIUC is the largest university chapter in the nation, made up 
                of hundreds of students and dozens of computer science areas. Dive in!
            </p>
            <SigListing 
            title='SIG Pwny'
            color="#3c5"
            barcolor="#84e899"
            paragraph1="We're a student-run interest group and
            CTF team at the University of Illinois at Urbana-Champaign
            focused on information security. All are welcome! We have
            a strong focus on kind and collaborative learning, because
            we believe that it's the most fun to be excellent to each
            other."
            paragraph2="We host weekly public meetings on low-barrier-of-entry
            security topics that are focused on collaborative learning and
            friendly environments. In addition, we run weekly seminars
            weekly for more in-depth exploration in topics like embedded
            device security, penetration testing, and fuzzing research.
            We're proudest of our library of recorded meetings."
            Image={pwny8}
            link="https://sigpwny.com/"
            chairs="Thomas Quig, Nathan Farlow"
            time="Thursday 6:00 PM - 7:00 PM"
            />
            <SigListing 
            title='SIG AIDA'
            color="#51c0c0"
            barcolor="#deffff"
            paragraph1="We're a student-run interest group and
            CTF team at the University of Illinois at Urbana-Champaign
            focused on information security. All are welcome! We have
            a strong focus on kind and collaborative learning, because
            we believe that it's the most fun to be excellent to each
            other."
            paragraph2="We host weekly public meetings on low-barrier-of-entry
            security topics that are focused on collaborative learning and
            friendly environments. In addition, we run weekly seminars
            weekly for more in-depth exploration in topics like embedded
            device security, penetration testing, and fuzzing research.
            We're proudest of our library of recorded meetings."
            Image="https://aida.acm.illinois.edu/static/adsa-logo-notext-9b02fdddd07f33d7ef3b4cd6a2e52ddb.png"
            link="https://aida.acm.illinois.edu/"
            chairs="Jeffrey Tang and Jacob Levine"
            time="Sunday 1:00 PM - 4:00 PM"
            />
            <SigListing 
            title='SIG AIDA'
            color="#51c0c0"
            barcolor="#deffff"
            paragraph1="We're a student-run interest group and
            CTF team at the University of Illinois at Urbana-Champaign
            focused on information security. All are welcome! We have
            a strong focus on kind and collaborative learning, because
            we believe that it's the most fun to be excellent to each
            other."
            paragraph2="We host weekly public meetings on low-barrier-of-entry
            security topics that are focused on collaborative learning and
            friendly environments. In addition, we run weekly seminars
            weekly for more in-depth exploration in topics like embedded
            device security, penetration testing, and fuzzing research.
            We're proudest of our library of recorded meetings."
            Image="https://aida.acm.illinois.edu/static/adsa-logo-notext-9b02fdddd07f33d7ef3b4cd6a2e52ddb.png"
            link="https://aida.acm.illinois.edu/"
            chairs="Jeffrey Tang and Jacob Levine"
            time="Sunday 1:00 PM - 4:00 PM"
            />
        </div>
    )   
}

export default SigListingSection