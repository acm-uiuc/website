import SigListing from "../../stories/SigListing";
import sigpwnylogo from "../../stories/assets/sigpwnylogo.svg";
import gamebuildlogo from "../../stories/assets/gamebuildlogo.png";
import siggraphlogo from "../../stories/assets/siggraphlogo.png";
import icpclogo from "../../stories/assets/icpclogo.png";

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
            Image={sigpwnylogo}
            link="https://sigpwny.com/"
            link2="https://discord.gg/GEMh8umbe7"
            link3="mailto:tquig2@illinois.edu"
            chairs="Thomas Quig and Nathan Farlow"
            time="Thursday 6:00 PM - 7:00 PM"
            />
            <SigListing 
            title='SIG AIDA'
            color="#51c0c0"
            barcolor="#deffff"
            paragraph1="We are the premier data science student 
            organization at the University of Illinois, inspiring students from 
            any background to reshape their perspective with data-driven decision making."
            paragraph2="Questions or comments? Join us on our Discord! We're always happy to meet new people!"
            Image="https://aida.acm.illinois.edu/static/adsa-logo-notext-9b02fdddd07f33d7ef3b4cd6a2e52ddb.png"
            link="https://aida.acm.illinois.edu/"
            link2="https://discord.gg/GEMh8umbe7"
            link3="mailto:awsong2@illinois.edu"
            chairs="Jeffrey Tang and Jacob Levine"
            time="Sunday 1:00 PM - 4:00 PM"
            />
            <SigListing 
            title='SIG Gamebuilders'
            color="#465ba0"
            barcolor="#627edc"
            paragraph1="GameBuilders is a special interest group at UIUC dedicated to game development
            and design. All skill levels and abilities are welcome."
            paragraph2="Our community is really friendly, so feel free to ask for advice related to 
            anything and ask people to share the games they've made. Visit us at the links to the right
            (small screens press the SIG title)."
            Image={gamebuildlogo}
            link="https://gamebuilders.acm.illinois.edu/"
            link2="https://discord.gg/g8VCGmm"
            link3="mailto:jt37@illinois.edu"
            chairs="Ruben Dorian Serrano"
            time="Sunday 6 PM virtually via Discord"
            />
            <SigListing 
            title='SIG GRAPH'
            color="#f9a857"
            barcolor="#ffedda"
            paragraph1="Learn computer graphics with our guided projects. Explore topics such as
            3D rendering, animation, physics simulation, and more. You also can create your
            own project proposals to explore new ideas."
            paragraph2="Check out our current projects on the website, where we show physics
            simulation, raytracing, realtime rendering, Island Survival Game,
            Audio Visualizer, and Rendering Engine. Join our discord and our weekly
            meetings at Siebel."
            Image={siggraphlogo}
            link="https://siggraph.acm.illinois.edu/#/"
            link2="https://discord.gg/QtKSUBgJe3"
            link3="mailto:siggraphuiuc@gmail.com"
            chairs="Stacy Zeng, Michael Korenchan, Ameer Taher, Ben Wei"
            time="Sunday 6 PM virtually via Discord"
            />
            <SigListing 
            title='SIG Mobile'
            color="#62b0ff"
            barcolor="#51c0c0"
            paragraph1="A mobile development club with Android tutorials, iOS tutorials,
            guest lectures, and group projects. No experience required!"
            paragraph2=""
            Image="https://avatars.githubusercontent.com/u/11053426?s=200&v=4"
            link="https://github.com/SIGMobileUIUC"
            link2="https://discord.gg/2uhJztdtwu"
            link3="mailto:mgeimer2@illinois.edu"
            chairs=""
            time=""
            />
            <SigListing 
            title='SIGICPC'
            color="#ff6f6f"
            barcolor="#ffd8d8"
            paragraph1="Polish coding and problem solving skills to prepare
            for competitions/interviews at Illinois Programming League."
            paragraph2=""
            Image={icpclogo}
            link="http://icpc.cs.illinois.edu/"
            link2="https://campuswire.com/p/GACF2E8B2"
            link3="mailto:mgeimer2@illinois.edu"
            chairs=""
            time=""
            />
        </div>
    );
}

export default SigListingSection;