import styled from "styled-components"
import Card from "../../stories/Card"
import pwny8 from "../../stories/assets/pwny8.svg"
import geebee from "../../stories/assets/geebee-01.png"
import siggraphlogo from "../../stories/assets/siggraphlogo.png"
import icpclogo from "../../stories/assets/icpclogo.png"

const Container = styled.section`
    text-align: center;
`

const Grid = styled.div`
    display: grid;
    grid-gap: 60px;
    padding: 40px;
    margin-left: 200px;
    margin-right: 200px;
    grid-template-columns: repeat(auto-fill,minmax(280px,1fr));
    grid-auto-flow: column;
    grid-auto-columns: minmax(280px,1fr);
    overflow-x: auto;
    &::-webkit-scrollbar {
        width: 0;
        background: transparent; // scrollbar invisible
    }
    @media screen and (max-width: 1100px) {
      margin-left: auto;
      margin-right: auto;
    }
`

const LinkContainer = styled.div``

const AllSigs = styled.a`
    cursor: pointer;
    color: #333;
    text-decoration: none;
    font-size: 20px;
    &:hover {
        color: #1976d2;
    }
`

const Sigscard = (props: any) => {
  return (
      <Container>
        <Grid>
           <Card title="SIGPwny"
          description="A friendly but elite club focused on cybersecurity. They host 
                      weekly learning meetings, participate in CTFs, and do 
                      cutting-edge cybersecurity research."
          link1="https://sigpwny.com/"
          link2="https://sigpwny.com/discord"
          Imagesrc={pwny8}
          linktext1="Website"
          linktext2="Discord"
          />
          <Card title="SIGAIDA"
          description="We are the premier data science
          organization at UIUC, inspiring students to reshape their perspective on data."
          link1="https://aida.acm.illinois.edu/"
          link2="https://discord.gg/GEMh8umbe7"
          Imagesrc="https://aida.acm.illinois.edu/static/adsa-logo-notext-9b02fdddd07f33d7ef3b4cd6a2e52ddb.png"
          linktext1="Website"
          linktext2="Discord"
          />
          <Card title="SIGMobile"
          description="A mobile development club with Android tutorials, iOS tutorials,
          guest lectures, and group projects. No experience required!"
          link1="https://github.com/SIGMobileUIUC"
          link2="https://discord.gg/2uhJztdtwu"
          Imagesrc="https://avatars.githubusercontent.com/u/11053426?s=200&v=4"
          linktext1="Github"
          linktext2="Discord"
          />
          <Card title="SIGGamebuilders"
          description="Anything and everything related to game development
          and design. All skill levels and abilities are welcome."
          link1="https://gamebuilders.acm.illinois.edu/"
          link2="https://discord.gg/g8VCGmm"
          Imagesrc={geebee}
          linktext1="Website"
          linktext2="Discord"
          />
          <Card title="SIGGRAPH"
          description="Learn computer graphics in guided projects, 3D rendering,
          animation, physics simulation, etc. Create your own projects."
          link1="https://siggraph.acm.illinois.edu/#/"
          link2="https://discord.gg/QtKSUBgJe3"
          Imagesrc={siggraphlogo}
          linktext1="Website"
          linktext2="Discord"
          />
          <Card title="SIGICPC"
          description="Polish coding and problem solving skills to prepare
          for competitions/interviews at Illinois Programming League."
          link1="http://icpc.cs.illinois.edu/"
          link2="https://campuswire.com/p/GACF2E8B2"
          Imagesrc={icpclogo}
          linktext1="Website"
          linktext2="Campuswire"
          />
        </Grid>
        <LinkContainer>
            <AllSigs href="">See All Sigs »</AllSigs>
        </LinkContainer>
      </Container>
  )
}
  
export default Sigscard