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
import purplelogo from "../../stories/assets/purplelogo.png"; // if someone doesn't have an image use 'purplelogo'

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
                name="Matt Geimer"
                Imagesrc={chair}
                email="mailto:mgeimer2@illinois.edu"
                discord="intel#8080"
                />
                <LeadershipCard 
                title="Vice Chair"
                name="Nitya Sunkad" 
                Imagesrc={vicechair} 
                email="mailto:nsunkad2@illinois.edu"
                />
                <LeadershipCard 
                title="Treasurer"
                name="Evan Matthews"
                Imagesrc={treasurer} 
                email="mailto:evanmm3@illinois.edu"
                />
                <LeadershipCard 
                title="Secretary"
                name="Emily Crawford"
                Imagesrc={secretary}
                email="mailto:emilyc7@illinois.edu"
                />
            </GridModify>
        </Content>
    );
};

export default LeadSection;