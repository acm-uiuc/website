import styled from 'styled-components';
import Header from '../components/Header/Header';
import Transition from '../components/Transition/Transition';
import Text from '../components/Text/Text';

const Container = styled.div`
  background-color: ${(props) => props.theme.colors.acmDark};
  color: white;
  position: relative;
  text-align: center;
  padding-bottom: 20px;
`;

const FooterContainer = styled.div`
  display: flex;
`;

const AllContent = styled.div`
  width: 100%;
  height: 100%;
`;

const Title = styled((props) => <Header level={3} {...props} />)`
  color: ${(props) => props.theme.fontColors.bodyLight};
`;

const ExternalLinkDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const SingleLinkDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 250px;
  height: 25px;
  margin: 15px 5px;
`;

const Href = styled((props) => <Text as="a" {...props} />)`
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
  color: ${(props) => props.theme.fontColors.bodyLight};
`;

const Copyright = styled.h5``;

export const Footer = () => (
  <>
    <Transition to={'#3E486F'} />
    <Container>
      <FooterContainer>
        <AllContent>
          <Title>Connect with ACM @ UIUC</Title>
          <ExternalLinkDiv>
            <SingleLinkDiv>
              <Href
                href="https://discord.gg/strhfywPdw"
                target="_blank"
                rel="noreferrer"
              >
                Discord
              </Href>
            </SingleLinkDiv>
            <SingleLinkDiv>
              <Href
                href="https://www.facebook.com/acmuiuc"
                target="_blank"
                rel="noreferrer"
              >
                Facebook
              </Href>
            </SingleLinkDiv>
            <SingleLinkDiv>
              <Href
                href="https://instagram.com/acm.uiuc"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </Href>
            </SingleLinkDiv>
            <SingleLinkDiv>
              <Href
                href="https://github.com/acm-uiuc"
                target="_blank"
                rel="noreferrer"
              >
                Github
              </Href>
            </SingleLinkDiv>
            <SingleLinkDiv>
              <Href
                href="https://acm-uiuc.slack.com/"
                target="_blank"
                rel="noreferrer"
              >
                Slack
              </Href>
            </SingleLinkDiv>
          </ExternalLinkDiv>
        </AllContent>
      </FooterContainer>
    </Container>
  </>
);

export default Footer;
