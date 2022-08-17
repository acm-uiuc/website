import styled from 'styled-components';
import Button from '../Button/Button';
import Content from '../Content/Content';
import Header from '../Header/Header';
import Text from '../Text/Text';

const HeroBackground = styled.section`
  background-color: ${(props) => props.theme.colors.acmDark};
  background-image: url('vertical.svg'), url('horizontal.svg');
  background-position: top right -35vw, bottom -600vh left -7vw;
  @media (min-width: ${(props) => props.theme.breakpoints.xl}px) {
    background-position: top right -10vw, bottom -20vh left -7vw;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.lg}px) {
    background-position: top right -15vw, bottom -40vh left -15vw;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.md}px) px {
    background-position: top right -25vw, bottom -40vh left -7vw;
  }
  @media (max-width: ${(props) => props.theme.breakpoints.md}px) {
    background-position: top right -1000vw, bottom -4000vw left;
  }
  background-repeat: no-repeat, no-repeat;
  background-size: auto 150%, auto 120%;
`;

const HeroHeader = styled(Header)`
  margin-top: 0px;
  margin-bottom: 30px;
  color: ${(props) => props.theme.fontColors.bodyLight};
`;

const HeaderImageSplit = styled.div`
  @media (min-width: ${(props) => props.theme.breakpoints.md}px) {
    display: grid;
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
    padding-top: 5vh;
  }
`;

const IntroText = styled.div`
  color: ${(props) => props.theme.colors.white};
`;

const Card = styled.div`
  background-color: ${(props) => props.theme.colors.cardLight};
  border-radius: 18px;
  max-width: 100%;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.35);
`;

const HeaderText = styled(Text)`
  font-size: ${(props) => props.theme.fontSizes.largebody}px;
  padding-right: 20px;
  margin-bottom: 50px;

  @media (max-width: ${(props) =>
      props.theme.breakpoints.lg}px) and (min-width: ${(props) =>
      props.theme.breakpoints.md}px) {
    padding-right: 150px;
  }
`;

const JoinButton = styled(Button)`
  font-size: ${(props) => props.theme.fontSizes.h3}px;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
`;

const Icon = styled((props) => <Button {...props} variant="punch-through" />)`
  width: 55px;
  height: 55px;
  margin-left: 20px;
`;

const IconImage = styled.img`
  width: 35px;
  height: 35px;
  margin-top: 5px;
  margin-left: -10px;
`;

const Left = styled.div`
  display: none;
  @media (max-width: ${(props) => props.theme.breakpoints.md}px) {
    display: block;
    padding-top: 30px;
    padding-bottom: 30px;
  }
`;

const Right = styled.div`
  @media (max-width: ${(props) => props.theme.breakpoints.md}px) {
    display: none;
  }
`;

const EventCard = styled(Card)`
  padding: 10px;
  @media (max-width: 600px) {
    margin-bottom: 20px;
  }
`;

const EventDetails = styled(Header)`
  margin-top: 0px;
  margin-bottom: 10px;
  color: ${(props) => props.theme.fontColors.bodyMedium};
`;

const EventTitle = styled(Header)`
  margin-top: 0px;
  padding-top: 0px;
  margin-bottom: 3px;
  color: ${(props) => props.theme.fontColors.default};
`;

const EventText = styled(Text)`
  margin-bottom: 5px;
  margin-top: 0px;
`;

type EventProps = {
  location: string;
  date: string;
  title: string;
  description: string;
};
function Event({ location, date, title, description }: EventProps) {
  return (
    <EventCard>
      <EventDetails level={6}>
        {location}, {date}
      </EventDetails>
      <EventTitle level={3}>{title}</EventTitle>
      <EventText>{description}</EventText>
    </EventCard>
  );
}

const EventsContainer = styled.div`
  margin-top: 60px;
  padding-bottom: 60px;
  @media (min-width: 600px) {
    display: grid;
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
    gap: 20px;
  }
`;

function Hero() {
  return (
    <HeroBackground>
      <Content as="section">
        <HeaderImageSplit>
          <Left>
            <Card as="img" src={require('./header.jpg')} />
          </Left>
          <IntroText>
            <HeroHeader level={1}>
              UIUC's Largest Computer Science Organization
            </HeroHeader>
            <HeaderText>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras quis
              varius elit. Quisque ex diam, consectetur pharetra sem vel,
              finibus pulvinar elit.
            </HeaderText>
            <ButtonRow>
              <JoinButton large variant="neutral">
                Join Now
              </JoinButton>
              <Icon>
                <a href="https://instagram.com/acm.uiuc" target='_blank' rel='noreferrer'>
                  <IconImage src="instagram.svg" />  
                </a>
              </Icon>
              <Icon>
                <a href="https://discord.gg/strhfywPdw" target='_blank' rel='noreferrer'>
                  <IconImage src="discord.svg" />
                </a>
              </Icon>
            </ButtonRow>
          </IntroText>
          <Right>
            <Card as="img" src={require('./header.jpg')} />
          </Right>
        </HeaderImageSplit>
        <EventsContainer>
          <Event
            title="ACM Scavenger Hunt"
            description="Join ACM as we make new friends and explore some famous UIUC landmarks! The group that completes the most challenges will win some sweet prizes!"
            date="Thursday, Aug 25, 4-6PM"
            location="Siebel Center for CS"
          />
          <Event
            title="Weekly Happy Hour"
            description="Join ACM and chat with some of your fellow members! Enjoy free food on us as you get a chance to know your peers better!"
            date="Friday, Aug 26, 5PM"
            location="Legend's"
          />
          <Event
            title="Field Day"
            description="Run around with ACM as we participate in a gigantic Capture the Flag game. The winning team will receive an awesome prize!"
            date="Saturday, Aug 27, 12-2PM"
            location="South Quad"
          />
        </EventsContainer>
      </Content>
    </HeroBackground>
  );
}

export default Hero;
