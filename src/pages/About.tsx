import styled from 'styled-components';
import Header from '../components/Header/Header';
import Text from '../components/Text/Text';
import Navbar from '../components/Navbar/Navbar';
import Content from '../components/Content/Content';
import Transition from '../components/Transition/Transition';
import Committee from '../components/Committee/Committee';
import social from '../stories/assets/social.jpg';
import capitalone from '../stories/assets/capitalone.png';
import Footersection from '../sections/Footersection';
import instagram from '../stories/assets/instagram.png';
import reflections from '../stories/assets/reflections.jpg';
import hackillinoislogo from '../stories/assets/hackillinoislogo.png';
import infrastructure from '../stories/assets/infrastructure.jpeg';
import LeadSection from '../sections/about/LeadershipSection';
import { NavLink } from 'react-router-dom';

const PaddedNav = styled(Navbar)`
  padding-bottom: 20px;
`;

const AboutHeader = styled(Header)`
  margin-top: 00px;
  padding-top: 0px;
  margin-bottom: 20px;
`;

const CommitteeHeader = styled(Header)`
  margin-bottom: 10px;
`;

const About = () => {
  return (
    <>
      <PaddedNav />
      <Transition to="#fff" />
      <Content as="section">
        <AboutHeader level={1}>About us</AboutHeader>
        <Text>
        ACM@UIUC is the <a style={{ textDecoration: 'none', color: '#4577F8' }} href="https://www.acm.org/" target="_blank" rel="noreferrer">Association for Computing Machinery</a> student 
        chapter, the world's largest scientific computer society. We are a group of 
        dedicated people interested in exploring the possibilities of computers 
        and discovering new ways to use them!
        </Text>
        <Text>
        ACM contains Special Interest Groups, or SIGs, which focus on specific 
        competencies in computer science. At our chapter, each SIG operates under 
        ACM@UIUC with free range over its meetings, activities, and purpose. Some 
        SIGs are project-based and devote time to building something innovative or 
        spectacular to showcase. Others are dedicated to teaching, using talks and 
        workshops to help their members understand a particular topic. You can learn 
        more about each SIG on our <NavLink style={{ textDecoration: 'none', color: '#4577F8' }} to="/" className="navLink">home page</NavLink>!
        </Text>
        <Text>
        ACM@UIUC also runs various events throughout the year, such as ACM Open House, 
        which showcases all the different SIGs at the beginning of each semester, <a style={{ textDecoration: 'none', color: '#4577F8' }} href="https://www.reflectionsprojections.org/" target="_blank" rel="noreferrer">Reflections | Projections</a>, 
        our annual computing conference, and <a style={{ textDecoration: 'none', color: '#4577F8' }} href="https://hackillinois.org/" target="_blank" rel="noreferrer">HackIllinois</a>, 
        which is one of the largest hackathons in the nation. We also host a variety of 
        outreach and social events, such as picnics, activity weeks, ACM Happy Hour, 
        and our annual bar crawl. Our SIGs also run their own events! These events are 
        open to all of UIUC, regardless of technical experience or background!
        </Text>
        <Text>
        Our executive meetings occur every other week and are open to the public. 
        The ACM officer board, as well as SIG and committee leads, drive discussion 
        about important ACM matters and make decisions based on the consensus of meeting attendees.
        </Text>
        <Text>ACM@UIUC is a registered 501(c)(3) nonprofit organization.</Text>
        <Header level={1}>Leadership</Header>
        <LeadSection />
        <Header level={1} id="committees">
          Committees
        </Header>
        <a
          href="https://www.reflectionsprojections.org/"
          style={{ textDecoration: 'none' }}
        >
          <CommitteeHeader
            level={3}
            id="reflections"
            style={{ color: '#4577F8' }}
          >
            Reflections | Projections
          </CommitteeHeader>
        </a>
        <Committee
          image={reflections}
          title="We provide a forum to share and learn about progress 
                in computer science, with industry and academia 
                tech talks, workshops and events 
                for attendees, Mechmania, and Diversity × Tech."
          position='Chairs:'
          people="Garima Sharma, Sumedh Vaidyanathan"
          email={['garimas2@illinois.edu', 'sumedhv2@illinois.edu']}
        />
        <a href="https://hackillinois.org/" style={{ textDecoration: 'none' }}>
          <CommitteeHeader
            level={3}
            id="hackillinois"
            style={{ color: '#4577F8' }}
          >
            Hack Illinois
          </CommitteeHeader>
        </a>
        <Committee
          image={hackillinoislogo}
          title="HackIllinois is the premier collegiate hackathon. 
                  With over 1000 attendees and 50 mentors in 2019, the hackathon 
                  has become one of the largest and most well-regarded in the 
                  nation."
          position='Chairs:'
          people="Jonathan Gao, Deeya Bodas"
          email={['jg48@illinois.edu', 'deeyaab2@illinois.edu']}
        />
        <CommitteeHeader level={3}>Corporate</CommitteeHeader>
        <Committee
          image={capitalone}
          title="The corporate team handles communication with ACM@UIUC's sponsors, 
                including Numerade, IMC, and more."
          position='Chair:'
          email="yipengy2@illinois.edu"
          people="Yipeng Yang"
        />
        <CommitteeHeader level={3}>Social</CommitteeHeader>
        <Committee
          image={social}
          title="The social team organizes fun events for ACM@UIUC such as 
                picnics, activity weeks, game nights, and Happy Hour."
          position='Chairs:'
          people="Sujit Varadhan, Akul Joshi"
          email={['sujitv2@illinois.edu', 'akulj2@illinois.edu']}
        />
        <CommitteeHeader level={3}>Marketing</CommitteeHeader>
        <Committee
          image={instagram}
          title="The marketing team organizes social media and branding for ACM@UIUC."
          position='Chairs:'
          people="Emma Hartman, Minh Duong, Riya Kulkarni"
          email={['emmaih2@illinois.edu', 'minhd2@illinois.edu', 'riyark3@illinois.edu']}
        />
        <CommitteeHeader level={3}>Infrastructure</CommitteeHeader>
        <Committee
          image={infrastructure}
          title="The infra team maintains ACM@UIUC's infrastructure and engineering efforts
                like this website."
          position='Chairs:'
          people="Steven Gao, Ryan Ziegler"
          email={['hongyig3@illinois.edu', 'ryanjz2@illinois.edu']}
        />
      </Content>
      <Footersection />
    </>
  );
};

export default About;
