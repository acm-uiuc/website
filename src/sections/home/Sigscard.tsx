import styled from 'styled-components';
import Card from '../../stories/Card';
import pwny8 from '../../stories/assets/pwny8.svg';
import geebee from '../../stories/assets/geebee-01.png';
import siggraphlogo from '../../stories/assets/siggraphlogo.png';
import icpclogo from '../../stories/assets/icpclogo.png';
import Content from '../../components/Content/Content';
import Button from '../../components/Button/Button';

const Container = styled.section`
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  margin-left: -20px;
  margin-top: -20px;
  padding-left: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
  grid-gap: 20px;
  @media (min-width: 600px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
  overflow-x: auto;
  width: 100%;
  padding-right: 20px;
  margin-right: 20px;
`;

const LinkContainer = styled.div`
  display: flex;
  align-content: center;
  justify-content: center;
`;

const AllSigs = styled((props) => (
  <Button as="a" large variant="neutral" {...props} />
))`
  text-decoration: none;
  margin-top: 15px;
  font-size: ${(props) => props.theme.fontSizes.h3}px;
`;

const Sigscard = (props: any) => {
  return (
    <Content as="div" style={{ marginBottom: 60 }}>
      <Grid>
      <Card
          title="SIGPwny"
          description="A SIG focused on cybersecurity. We host 
                      learning meetings, participate in CTFs, and do 
                      cutting-edge research."
          link1="https://sigpwny.com/"
          link2="https://discord.com/invite/cWcZ6a9"
          Imagesrc={pwny8}
          linktext1="Website"
          linktext2="Discord"
        />
        <Card
          title="SIGAIDA"
          description="We are the premier data science
          organization at UIUC, inspiring students to reshape their perspective on data."
          link1="https://aida.acm.illinois.edu/"
          link2="https://discord.gg/GEMh8umbe7"
          Imagesrc="https://aida.acm.illinois.edu/static/adsa-logo-notext-9b02fdddd07f33d7ef3b4cd6a2e52ddb.png"
          linktext1="Website"
          linktext2="Discord"
        />
        <Card
          title="SIGMobile"
          description="A mobile development club with Android tutorials, iOS tutorials,
          guest lectures, and group projects."
          link1="https://github.com/SIGMobileUIUC"
          link2="https://discord.gg/2uhJztdtwu"
          Imagesrc="https://avatars.githubusercontent.com/u/11053426?s=200&v=4"
          linktext1="Github"
          linktext2="Discord"
        />
        <Card
          title="SIGGamebuilders"
          description="Anything and everything related to game development
          and design. All skill levels and abilities are welcome."
          link1="https://gamebuilders.acm.illinois.edu/"
          link2="https://discord.gg/g8VCGmm"
          Imagesrc={geebee}
          linktext1="Website"
          linktext2="Discord"
        />
        <Card
          title="SIGGRAPH"
          description="Learn computer graphics in guided projects, 3D renderings,
          animations, physics simulations, and more."
          link1="https://siggraph.acm.illinois.edu/#/"
          link2="https://discord.gg/QtKSUBgJe3"
          Imagesrc={siggraphlogo}
          linktext1="Website"
          linktext2="Discord"
        />
        <Card
          title="SIGICPC"
          description="Polish coding and problem solving skills to prepare
          for competitions/interviews at Illinois Programming League."
          link1="http://icpc.cs.illinois.edu/"
          link2="https://campuswire.com/p/GACF2E8B2"
          Imagesrc={icpclogo}
          linktext1="Website"
          linktext2="Campuswire"
        />
        <Card
          title="SIGCHI"
          description="Learn about human-computer interaction in research,
          projects, and workshops while meeting new people."
          link1="https://sigchi.acm.illinois.edu/"
          link2="https://discord.com/invite/7JGRSJv"
          Imagesrc={siggraphlogo}
          linktext1="Website"
          linktext2="Discord"
        />
        <Card
          title="GLUG"
          description="Immerse in Linux-based operating systems and the 
          wider open source world."
          link1="http://lug.acm.illinois.edu/"
          link2="https://discord.gg/Rgf82yh7jU"
          Imagesrc={siggraphlogo}
          linktext1="Website"
          linktext2="Discord"
        />
        <Card
          title="SIGMusic"
          description="We are a project-based SIG with presentations 
          focused on audio synthesis, algorithmic composition, etc."
          link1="http://sigmusic.acm.illinois.edu/"
          link2="https://discord.com/invite/zMtv6Qz"
          Imagesrc={siggraphlogo}
          linktext1="Website"
          linktext2="Discord"
        />
        <Card
          title="SIGQuantum"
          description="Our SIG provides inclusive environment for 
          students to discover and disrupt the Quantum Computing community."
          link1=""
          link2="https://discord.gg/PmaXeHPaFs"
          Imagesrc={siggraphlogo}
          linktext1="TBD"
          linktext2="Discord"
        />
        <Card
          title="SIGma"
          description="Natural language processing theory: do projects, workshops, and learn about
          it and its techniques."
          link1=""
          link2="https://discord.gg/kepXvpZXrs"
          Imagesrc={siggraphlogo}
          linktext1="TBD"
          linktext2="Discord"
        />
      </Grid>
      <LinkContainer>
        <AllSigs href="">See All SIGs »</AllSigs>
      </LinkContainer>
    </Content>
  );
};

export default Sigscard;
