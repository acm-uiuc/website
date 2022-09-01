import styled from "styled-components";
import {
    Container,
    Layout,
    LowerLayout,
    Href,
} from "./Card.styles";
import { HiOutlineMail } from "react-icons/hi";
import { SiDiscord } from "react-icons/si";
import Header from "../Header/Header";
import Text from "../Text/Text";

const LeaderContainer = styled(Container)`
  height: 380px;
  background-color: white;
  width: 270px;
  filter: none;
  transition: none;
  border: none;
  &:hover {
    border: none;
    filter: none;
    transform: none;
  }
`;

const LeaderLayout = styled(Layout)`
    justify-content: center;
`;

const TopContent = styled.div`
  width: 100%;
  padding-top: 10px;
  text-align: center;
  height: 65px;
`;

const LeaderTitle = styled((props) => <Header level={3} {...props} />)`
  font-weight: 600;
  line-height: 22px;
  margin: 0px;
  padding-bottom: 10px;
  color: #3E486F;
`;

const Name = styled(Text)`
  margin-top: 0;
`;

const Discord = styled(Href)`
  margin-top: 0;
  color: black;
  padding: none;
  transition: none;
  cursor: auto;
  &:hover {
    background-color: white;
  }
`;

const Imagecontent = styled.img`
  height: 250px;
  width: 250px;
  object-fit: cover;
`;

const IconLayout = styled(LowerLayout)`
    text-align: center;
`;

interface LeadershipCardProps {
    title: string
    name: string
    Imagesrc?: string
    email?: string
    discord?: string
}

export const LeadershipCard = ({
    title,
    name,
    Imagesrc,
    email,
    discord,
}: LeadershipCardProps) => (
    <LeaderContainer>
        <LeaderLayout>
            <Imagecontent src={Imagesrc} />
            <TopContent>
                <LeaderTitle>
                    {title}
                </LeaderTitle>
                <Name>
                    {name}
                </Name>
            </TopContent>
            <IconLayout>
                <Href href={email}>
                    <HiOutlineMail />
                </Href>
                {/*<Href>
                    <SiDiscord />
                </Href>
                <Discord>{discord}</Discord>
                */}
            </IconLayout>
        </LeaderLayout>
    </LeaderContainer>
);

export default LeadershipCard;