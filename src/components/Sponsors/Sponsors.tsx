import styled from 'styled-components';
import Transition from '../Transition/Transition';
import Content from '../Content/Content';
import Header from '../Header/Header';
import Text from '../Text/Text';

const SponsorsHeader = styled(Header)`
  margin-top: 0px;
  padding-top: 20px;
  margin-bottom: 20px;
`;

const ContentContainer = styled.div`
  background-color: #efefef;
  width: 100%;
  padding-bottom: 40px;
`;

const Description = styled(Text)`
  font-size: ${(props) => props.theme.fontSizes.largebody}px;
  max-width: ${(props) => props.theme.breakpoints.md}px;
  margin-bottom: 20px;
`;

const SponsorsGrid = styled.div`
  display: grid;
  gap: 20px;
  @media (min-width: 600px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
  max-width: 100%;
`;

const SponsorImage = styled.img`
  width: 100%;
`;

function Sponsors() {
  return (
    <>
      <Transition to="#efefef" />
      <ContentContainer>
        <Content as="section">
          <SponsorsHeader level={1} id="sponsors">
            Sponsors
          </SponsorsHeader>
          <Description>
            ACM is thankful to these generous companies who support our
            organization. Sponsor companies get access to our resume book and
            some other cool things. If you're interested in sponsoring ACM,
            email drshika2@illinois.edu.
          </Description>
          <SponsorsGrid>
            <a href="https://numerade.com">
              <SponsorImage src={require('./Numerade_Logo.png')} />
            </a>
            <a href="https://imc.com">
              <SponsorImage src={'/IMC_logo.svg'} />
            </a>
          </SponsorsGrid>
        </Content>
      </ContentContainer>
    </>
  );
}

export default Sponsors;
