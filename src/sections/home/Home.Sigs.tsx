import styled from "styled-components";
import Card from "../../stories/Card";
import pwny8 from '../../pwny8.svg';

const Container = styled.section`
`

const Title = styled.h1`
    font-size: 40px;
`

const SubTitle = styled.p`
    font-size: 25px;
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

const LinkContainer = styled.div`
`

const AllSigs = styled.a`
    cursor: pointer;
    color: black;
    text-decoration: none;
    &:hover {
        color: #1976d2;
    }
`

function Sigs() {
    return (
      <Container>
        <Title>Special Interest Groups (SIGs)</Title>
        <SubTitle>Explore any of your Computer Science interests in over 10 SIGs!</SubTitle>
        <Grid>
           <Card title="SIGPwny" 
          description="A friendly but elite club focused on cybersecurity. They host 
                      weekly learning meetings, participate in CTFs, and do 
                      cutting-edge cybersecurity research."
          link="https://sigpwny.com/"
          Imagesrc={pwny8}
          linktext1="Website" 
          linktext2="Discord"
          />
          <Card title="SIGAIDA"
          description="We are the premier data science student organization at the University of Illinois
          "
          link="https://aida.acm.illinois.edu/"
          Imagesrc="https://aida.acm.illinois.edu/static/adsa-logo-notext-9b02fdddd07f33d7ef3b4cd6a2e52ddb.png"
          linktext1="Website" 
          linktext2="Discord"
          />
          <Card title="SIGMobile" 
          description="Special Interest Group for Mobile Development."
          link="http://github.com/SIGMobileUIUC"
          Imagesrc="https://avatars.githubusercontent.com/u/11053426?s=200&v=4"
          linktext1="Github" 
          linktext2="Discord"
          />
          <Card title="SIGMobile" 
          description="Special Interest Group for Mobile Development."
          link="http://github.com/SIGMobileUIUC"
          Imagesrc="https://avatars.githubusercontent.com/u/11053426?s=200&v=4"
          linktext1="Github" 
          linktext2="Discord"
          />
          <Card title="SIGMobile" 
          description="Special Interest Group for Mobile Development."
          link="http://github.com/SIGMobileUIUC"
          Imagesrc="https://avatars.githubusercontent.com/u/11053426?s=200&v=4"
          linktext1="Github" 
          linktext2="Discord"
          />
          <Card title="SIGMobile" 
          description="Special Interest Group for Mobile Development."
          link="http://github.com/SIGMobileUIUC"
          Imagesrc="https://avatars.githubusercontent.com/u/11053426?s=200&v=4"
          linktext1="Github" 
          linktext2="Discord"
          />
        </Grid>
        <LinkContainer>
            <AllSigs href="">See All Sigs »</AllSigs>
        </LinkContainer>
      </Container>
    );
  }

  export default Sigs;