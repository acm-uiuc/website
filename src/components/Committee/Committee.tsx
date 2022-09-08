import styled from 'styled-components';
import Text from '../Text/Text';

const Container = styled.div`
  width: 900px;
  height: 350px;
  display: flex;
  border-top: 1px solid grey;
  @media screen and (max-width: 963px) {
    max-width: 100%;
    height: fit-content;
    display: block;
  }
  @media screen and (max-width: 500px) {
    margin: auto;
  }
  padding-bottom: 60px;
`;

const Imagediv = styled(Container)`
  width: 100%;
  padding: 24px 0;
  border-top: none;
`;

const Image = styled.img`
  max-width: 100%;
  height: 350px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  border-radius: 25px;
`;

const Contentdiv = styled(Container)`
  display: flex;
  flex: 1 1 50%;
  flex-direction: column;
  justify-content: space-between;
  width: 50%;
  padding: 50px;
  border-top: none;
  text-align: left;
  @media screen and (max-width: 963px) {
    height: fit-content;
    width: 100%;
    padding: 0;
  }
`;

const People = styled.p`
  text-transform: uppercase;
  @media screen and (max-width: 963px) {
    display: none;
  }
`;

const Description = styled(Text)`
  font-size: 20px;
  line-height: 30px;
  padding-top: 20px;
  @media screen and (max-width: 963px) {
    padding-top: 0;
  }
`;

const Contact = styled.div`
  height: 150px;
  overflow: hidden;
  padding-top: 20px;
  @media screen and (max-width: 963px) {
    display: none;
  }
`;

interface CommitteeProps {
  people?: string;
  contactinfo?: string;
  title: string;
  image: string;
}

export const Committee = ({
  people,
  contactinfo,
  title,
  image,
}: CommitteeProps) => (
  <Container>
    <Imagediv>
      <Image src={image} />
    </Imagediv>
    <Contentdiv>
      <div>
        <People>{people}</People>
        <Description>{title}</Description>
        <Contact>
          <div>
            <p>
              {/*Contact the committee: {contactinfo}.*/}
              {contactinfo}
            </p>
          </div>
        </Contact>
      </div>
    </Contentdiv>
  </Container>
);

export default Committee;
