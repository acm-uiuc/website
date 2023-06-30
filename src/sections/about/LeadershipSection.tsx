import Content from "../../components/Content/Content";
import LeadershipCard from "../../components/Card/LeadershipCard";
import {
    Grid,
} from "../home/Sigscard";
import chair from "../../stories/assets/chair.jpeg";
import vicechair from "../../stories/assets/vicechair.jpg";
import treasurer from "../../stories/assets/treasurer.jpeg";
import secretary from "../../stories/assets/secretary.jpeg";
import styled from "styled-components"; 

const GridModify = styled(Grid)`
  @media (min-width: 600px) {
    grid-template-columns: 1fr;
  }
  @media (min-width: 710px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (min-width: 1200px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

const LeadSection = (props: any) => {
    return (
        <Content as="div">
            <GridModify>
                <LeadershipCard
                title="Chair"
                name="Deeya Bodas"
                Imagesrc={chair}
                email="mailto:deeyaab2@illinois.edu"
                />
                <LeadershipCard 
                title="Vice Chair"
                name="Aydan Piriani" 
                Imagesrc={vicechair} 
                email="mailto:apirani2@illinois.edu"
                />
                <LeadershipCard 
                title="Treasurer"
                name="Dev Singh"
                Imagesrc={treasurer} 
                email="mailto:treasurer@acm.illinois.edu"
                />
                <LeadershipCard 
                title="Secretary"
                name="Abhived Pulapaka"
                Imagesrc={secretary}
                email="mailto:abhived2@illinois.edu"
                />
            </GridModify>
        </Content>
    );
};

export default LeadSection;
