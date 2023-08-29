import styled, { css } from 'styled-components';
import Button from '../Button/Button';
import EventButton from '../Button/EventButton';
import Content from '../Content/Content';
import Header from '../Header/Header';
import Text from '../Text/Text';
import React from 'react';
import {
  FaDiscord,
  FaInstagram,
  FaLocationArrow,
  FaRegCalendarAlt,
  FaBell,
  FaSignInAlt,
} from 'react-icons/fa';
import { BsArrowRepeat } from "react-icons/bs";
import { string } from 'prop-types';
import eventList  from './events.json';
import Moment from 'moment';

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
  background-color: ${(props) => props.theme.colors.offWhite};
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

const JoinButton = styled((props: any) => (
  <Button large variant="neutral" {...props} />
))`
  font-size: ${(props) => props.theme.fontSizes.h3}px;
  @media (max-width:600px) {
    width:350px;
}
`;

const JoinEventButton = styled((props: any) => (
  <EventButton large variant="neutral" {...props} />
))`
  font-size: ${(props) => props.theme.fontSizes.h6}px;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap:0px 20px;
  
  @media (max-width:600px) {
    flex-wrap: wrap;
    justify-content:space-evenly;
    gap:1em;
    padding-right:0px;
    margin:-10px 0px -25px 0px;

}

`;

const Icon = styled((props) => <Button {...props} variant="punch-through" />)`
  width: 55px;
  height: 55px;
  background-color: white;
  padding-bottom:-20px

`;

const MobileIcon = styled(Icon)`
  @media (min-width:600px) {
    display: none;

  }
`

const IconImage = css`
  width: 35px;
  height: 35px;
  margin-top: 5px;
  margin-left: -10px;
  color: ${(props) => props.theme.colors.neutralBg};
`;

const IconInstagram = styled(FaInstagram)`
  ${IconImage}
`;

const IconDiscord = styled(FaDiscord)`
  ${IconImage}
`;

const IconBell = styled(FaBell)`
  ${IconImage}
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
  display: flex;
  flex-direction: column;
  padding: 15px;
  @media (max-width: 600px) {
    margin-bottom: 20px;
  }
  transition: 0.3s;
  box-shadow: none;

  &:hover {
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.35);
    transform: translateY(-3px);
  }
`;

const EventDetails = styled(({ link, ...rest }) =>
  link ? (
    <a href={link}>
      <Header {...rest} />
    </a>
  ) : (
    <Header {...rest} />
  )
)<{ link?: string }>`
  margin-top: 5px;
  margin-bottom: 0px;
  color: ${(props) => props.theme.fontColors.bodyMedium};

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2%;
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
  flex-grow: 1;
`;

function toHumanDate(date: string) {
  Moment.locale('en');
  return Moment(date).format("MMMM Do, h:mm A");
}

const JoinContainer = styled.div`
  display:flex;
`;
const InfoContainer = styled.div`
  display:block;
  width:200px;
`;

type EventProps = {
  location: string;
  locationLink?: string;
  date: string;
  dateLink?: string;
  title: string;
  description: string;
  repeats?: string | boolean;
  paidEventId?: string;
};
function Event({
  location,
  date,
  title,
  description,
  locationLink,
  dateLink,
  repeats,
  paidEventId
}: EventProps) {
  return (
    <EventCard>
      <EventTitle level={3}>{title}</EventTitle>
      <EventText>{description}</EventText>
      <JoinContainer>
        <InfoContainer>
          <EventDetails level={6} link={locationLink}>
            <FaLocationArrow /> {location}
          </EventDetails>
          <EventDetails level={6} link={dateLink}>
            <FaRegCalendarAlt /> {date}
          </EventDetails>
          {repeats ? <EventDetails level={6} link={dateLink}>
            <BsArrowRepeat /> Every {repeats}
          </EventDetails> : null}
        </InfoContainer>
        <EventDetails level={6} link={dateLink}>
          {paidEventId? <a href={"/#/event/" + paidEventId} target="_blank" rel="noreferrer">
            <JoinEventButton> <FaSignInAlt /> Register </JoinEventButton>
          </a> : null}
        </EventDetails>
      </JoinContainer>
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
            <Card as="img" src='/header.webp' onError={({ currentTarget }: {currentTarget: any}) => { currentTarget.onerror = null; currentTarget.src='/header.jpg';}} />
          </Left>
          <IntroText>
            <HeroHeader level={1}>
              UIUC's Largest Computer Science Organization
            </HeroHeader>
            <HeaderText>
              For over 50 years, ACM@UIUC has been a hub for innovation and
              leadership for students everywhere. Our inclusivity has created a
              strong network of students and alumni, bringing their diverse
              interests to ACM.
            </HeaderText>
            <ButtonRow>
              <a
                href="/#/membership"
                target="_blank"
                rel="noreferrer"
              >
                <JoinButton>Join Now</JoinButton>
              </a>
              <Icon>
                <a
                  href="https://instagram.com/acm.uiuc"
                  target="_blank"
                  rel="noreferrer"
                >
                  <IconInstagram />
                </a>
              </Icon>
              <Icon>
                <a
                  href="https://go.acm.illinois.edu/discord"
                  target="_blank"
                  rel="noreferrer"
                >
                  <IconDiscord />
                </a>
              </Icon>
              <MobileIcon>
                <a
                  href="https://forms.gle/PqRkNtyuPGDwkomK9"
                  target="_blank"
                  rel="noreferrer"
                >
                  <IconBell/>
                </a>
              </MobileIcon>
              
            </ButtonRow>
          </IntroText>
          <Right>
            <Card as="img" src='/header.webp' onError={({ currentTarget }: {currentTarget: any}) => { currentTarget.onerror = null; currentTarget.src='/header.jpg';}} />
          </Right>
        </HeaderImageSplit>
        <EventsContainer>
          {eventList.sort((a, b) => {
            return (Moment(a.date).unix() - Moment(b.date).unix());
          }).map((object, i) => {
            if (i > 2) { return null; }
            return <Event
            title={object.title}
            description={object.description}
            date={toHumanDate(object.date)}
            repeats={(object as any)?.repeats}
            location={object.location}
            locationLink={object.locationLink}
            paidEventId={object.paidEventId}
          />
          })}
        </EventsContainer>
      </Content>
    </HeroBackground>
  );
}

export default Hero;
