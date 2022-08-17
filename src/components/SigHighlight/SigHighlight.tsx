import styled from 'styled-components';
import Content from '../Content/Content';
import Text from '../Text/Text';
import Header from '../Header/Header';

/*type Sig = {
  logo: any;
  name: string;
  chairs: string;
  meetingTime: string;
  link: string;
};*/

/*type Props = {
  sigs: Sig[];
};*/

const SigHeader = styled(Header)`
  margin-top: 20px;
  margin-bottom: 20px;
`;

const SigText = styled(Text)`
  font-size: ${(props) => props.theme.fontSizes.largebody}px;
  max-width: ${(props) => props.theme.breakpoints.md}px;
`;

/*const Card = styled.div`
  background-color: ${(props) => props.theme.colors.white};
  border-radius: 18px;
  max-width: 100%;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.35);
`;*/

/*const SigGrid = styled.ul`
  list-style-type: none;
  padding: 0px;
  margin: 0px;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: 20px;
  margin-top: 40px;
`;*/

function SigHighlight() {
  return (
    <Content as="section">
      <SigHeader level={1}>Special Interest Groups</SigHeader>
      <SigText>
        SIGs, or Special Interest Groups, are student-run groups exploring
        different areas of computer science, from theory and algorithms to
        competitive programming. All our SIGs are beginner-friendly and are a
        great way to meet other members and explore computer science.
      </SigText>
      {/*<SigGrid>
        <Card> Hi</Card>
        <Card>Hi</Card>
        <Card>Hi</Card>
      </SigGrid>*/}
    </Content>
  );
}

export default SigHighlight;
