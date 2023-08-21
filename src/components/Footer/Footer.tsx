import styled from 'styled-components';
import Header from '../Header/Header';
import Transition from '../Transition/Transition';
import Text from '../Text/Text';

const Container = styled.div`
  background-color: ${(props) => props.theme.colors.acmDark};
  color: white;
  position: relative;
  text-align: center;
  padding-bottom: 30px;
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
  display: flex;
  justify-content: center;
  flex-direction: row;
  justify-content: space-around;
  max-width: ${(props) => props.theme.breakpoints.lg}px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
`;

const SingleLinkDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Href = styled((props) => <Text as="a" {...props} />)`
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
  color: ${(props) => props.theme.fontColors.bodyLight};
`;

export const Footer = () => (
  <>
    <Transition to={'#3E486F'} />
    <Container>
      <FooterContainer>
        <AllContent>
          <Title>Connect with ACM @ UIUC</Title>
          <ExternalLinkDiv>
            <Href
              href="https://discord.gg/ec8VX6bBJx"
              target="_blank"
              rel="noreferrer"
            >
              Discord
            </Href>

            <Href
              href="https://www.facebook.com/acmuiuc"
              target="_blank"
              rel="noreferrer"
            >
              Facebook
            </Href>

            <Href
              href="https://instagram.com/acm.uiuc"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </Href>
            <Href
              href="https://github.com/acm-uiuc"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </Href>
          </ExternalLinkDiv>
        </AllContent>
      </FooterContainer>
    </Container>
  </>
);

export default Footer;
