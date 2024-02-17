'use client';
import Card from '@/components/Card/Card';

//use webp logos where possible
import webp_sigpwnylogo from '@/stories/assets/sigpwnylogo.png.webp';
import webp_sigchilogo from '@/stories/assets/sigchilogo.png.webp';
import webp_gamebuildlogo from '@/stories/assets/gamebuildlogo.png.webp';
import webp_sigaidalogo from '@/stories/assets/sigaidalogo.png.webp';
import webp_siggraphlogo from '@/stories/assets/siggraphlogo.png.webp';
import webp_icpclogo from '@/stories/assets/icpclogo.png.webp';
import webp_sigmobilelogo from '@/stories/assets/sigmobilelogo.png.webp';
import webp_sigmusiclogo from '@/stories/assets/sigmusiclogo.png.webp';
import webp_gluglogo from '@/stories/assets/gluglogo.png.webp';
import webp_signlllogo from '@/stories/assets/signll_logo.png.webp';
import webp_sigmalogo from '@/stories/assets/sigmalogo.png.webp';
import webp_quiuclogo from '@/stories/assets/quiuclogo.png.webp';
import webp_sigecomlogo from '@/stories/assets/sigecomlogo.png.webp';
import webp_sigplanlogo from '@/stories/assets/sigplanlogo.png.webp';
import webp_sigpolicylogo from '@/stories/assets/sigpolicylogo.png.webp';
import webp_sigarchlogo from '@/stories/assets/sigarchlogo.png.webp';

// fallback to png if the browser doesn't support webp images.
import sigpwnylogo from '@/stories/assets/sigpwnylogo.png';
import sigchilogo from '@/stories/assets/sigchilogo.png';
import gamebuildlogo from '@/stories/assets/gamebuildlogo.png';
import sigaidalogo from '@/stories/assets/sigaidalogo.png';
import siggraphlogo from '@/stories/assets/siggraphlogo.png';
import icpclogo from '@/stories/assets/icpclogo.png';
import sigmobilelogo from '@/stories/assets/sigmobilelogo.png';
import sigmusiclogo from '@/stories/assets/sigmusiclogo.png';
import gluglogo from '@/stories/assets/gluglogo.png';
import signlllogo from '@/stories/assets/signll_logo.png';
import sigmalogo from '@/stories/assets/sigmalogo.png';
import quiuclogo from '@/stories/assets/quiuclogo.png';
import sigecomlogo from '@/stories/assets/sigecomlogo.png';
import sigplanlogo from '@/stories/assets/sigplanlogo.png';
import sigpolicylogo from '@/stories/assets/sigpolicylogo.png';
import sigarchlogo from '@/stories/assets/sigarchlogo.png';

export default function Sigscard() {
  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <Card
        title="SIGPwny"
        description="Learn cybersecurity from the ground up, play in competitions, 
        and do research. Beginners welcome!"
        link1="https://sigpwny.com/"
        link2="https://sigpwny.com/discord"
        imgwebp={webp_sigpwnylogo.src}
        img={sigpwnylogo}
        linktext1="Website"
        linktext2="Discord"
      />
      <Card
        title="SIGAIDA"
        description="We are the premier data science
        organization at UIUC, inspiring students to reshape their perspective on data."
        link2="https://go.acm.illinois.edu/aida_discord"
        imgwebp={webp_sigaidalogo.src}
        img={sigaidalogo}
        linktext2="Discord"
      />
      <Card
        title="SIGMobile"
        description="A mobile development club with Android tutorials, iOS tutorials,
        guest lectures, and group projects."
        link1="https://apoorvaditya.notion.site/SIGMobile-dc12c5f971aa43ffbd5435d8fcae91fe"
        link2="https://discord.gg/af6SvFWGSc"
        imgwebp={webp_sigmobilelogo.src}
        img={sigmobilelogo}
        linktext1="Notion"
        linktext2="Discord"
      />
      <Card
        title="GameBuilders"
        description="Anything and everything related to game development
        and design. All skill levels and abilities are welcome."
        link1="https://gamebuilders.acm.illinois.edu/"
        link2="https://discordapp.com/invite/2rND6FT"
        imgwebp={webp_gamebuildlogo.src}
        img={gamebuildlogo}
        linktext1="Website"
        linktext2="Discord"
      />
      <Card
        title="SIGGRAPH"
        description="Learn computer graphics in guided projects on 3D renderings,
        animations, physics simulations, and more."
        link1="https://siggraph.acm.illinois.edu/#/"
        link2="https://discord.com/invite/a5U333fNMX"
        imgwebp={webp_siggraphlogo.src}
        img={siggraphlogo}
        linktext1="Website"
        linktext2="Discord"
      />
      <Card
        title="ICPC"
        description="Polish coding and problem solving skills to prepare
        for competitions/interviews at Illinois Programming League."
        link1="http://icpc.cs.illinois.edu/"
        link2="https://campuswire.com/p/GACF2E8B2"
        imgwebp={webp_icpclogo.src}
        img={icpclogo}
        linktext1="Website"
        linktext2="Campuswire (4080)"
      />
      <Card
        title="SIGCHI"
        description="Learn about human-computer interaction in research,
        projects, and workshops while meeting new people."
        link1="https://sigchi.acm.illinois.edu/"
        link2="https://discord.gg/XRShsPCAQ3"
        imgwebp={webp_sigchilogo.src}
        img={sigchilogo}
        linktext1="Website"
        linktext2="Discord"
      />
      <Card
        title="GLUG"
        description="Immerse yourself in Linux-based operating systems and the 
        wider open source world."
        link1="http://lug.acm.illinois.edu/"
        link2="https://discord.gg/sWD3zxPyc2"
        link3="https://matrix.to/#/#gnulug:matrix.org"
        imgwebp={webp_gluglogo.src}
        img={gluglogo}
        linktext1="Website"
        linktext2="Discord"
        linktext3="Matrix" //testing third link
      />
      <Card
        title="SIGMusic"
        description="A project-based SIG with presentations 
        focused on audio synthesis, algorithmic composition, audio plugins, and more."
        link1="http://sigmusic.acm.illinois.edu/"
        link2="https://discord.gg/ug9NdWzD"
        imgwebp={webp_sigmusiclogo.src}
        img={sigmusiclogo}
        linktext1="Website"
        linktext2="Discord"
      />
      <Card
        title="SIGQuantum"
        description="Our SIG provides inclusive environment for 
        students to discover and disrupt the Quantum Computing community."
        link2="https://discord.gg/PmaXeHPaFs"
        imgwebp={webp_quiuclogo.src}
        img={quiuclogo}
        linktext2="Discord"
      />
      <Card
        title="SIGma"
        description="The place to learn about math and algorithms in CS. 
        Open to all regardless of mathematical background."
        link1="https://cstheory.org"
        link2="https://discord.gg/Sxf3h3pBbv"
        imgwebp={webp_sigmalogo.src}
        img={sigmalogo}
        linktext1="Website"
        linktext2="Discord"
      />
      <Card
        title="SIGNLL"
        description="Natural language processing theory: projects, workshops, 
        and learning techniques at this SIG."
        link2="https://discord.gg/wwYeewYkCG"
        imgwebp={webp_signlllogo.src}
        img={signlllogo}
        linktext2="Discord"
      />
      <Card
        title="SIGecom"
        description="Learn about the intersection of economics and computation. Open to all, regardless of background."
        link2="https://go.acm.illinois.edu/ecom_discord"
        imgwebp={webp_sigecomlogo.src}
        img={sigecomlogo}
        linktext2="Discord"
      />
      <Card
        title="SIGPLAN"
        description="Learn about the theory behind programming languages and type systems, and then make projects!"
        link2="https://discord.gg/t4TmDRDf9c"
        imgwebp={webp_sigplanlogo.src}
        img={sigplanlogo}
        linktext2="Discord"
      />
      <Card
        title="SIGPolicy"
        description="Discuss and understand software policy, ethics, law, and current events through a technological lens."
        link1="https://sigpolicy.acm.illinois.edu"
        link2="https://discord.gg/gKjMH54YBF"
        imgwebp={webp_sigpolicylogo.src}
        img={sigpolicylogo}
        linktext1="Website"
        linktext2="Discord"
      />
      <Card
        title="SIGARCH"
        description="Dedicated to teaching and exploring computer architecture, hardware security, and more."
        link1="https://sigarch.net/"
        link2="https://discord.gg/Mx8R389hWz"
        imgwebp={webp_sigarchlogo.src}
        img={sigarchlogo}
        linktext1="Website"
        linktext2="Discord"
      />
    </div>
  );
};
