import styled from "styled-components"
import Committee from "../../components/Committee/Committee";
import infra_pic from '../../stories/assets/infra_pic.png';
import social from '../stories/assets/social.jpg';

const Section = styled.section`
    display: flex;
    align-items: center;
    height: 750px;
    width: 1100px;
`

const ContentDiv = styled.div`
    padding-bottom: 400px;
    width: 50%;
    text-align: left;
`

const Title = styled.h1`
    font-size: 45px;
`

const Text = styled.h3`
    font-size: 25px;
    font-weight: 500;
    line-height: 1.1;
`

const Imagediv = styled.div`
    padding-bottom: 400px;
    width: 50%;
`

const Image = styled.img`
    width: inherit;
    height: inherit;
`

const CommitteeSection = () => {
    return (
        <Section>
            {/*<ContentDiv>
                <Title>ACM at UIUC</Title>
                <Text>
                    The Association for Computing Machinery at UIUC welcomes everyone to 
                    our committees and special interest groups (SIGs)!
                    <br /><br />
                    Scroll down to learn more about our fantastic committees!
                </Text>
            </ContentDiv>
            <Imagediv>
                <Image src="https://acm.illinois.edu/static/images/acm-logo-flat.svg" />
                </Imagediv>*/}
            <ContentDiv>
            <Committee 
                image= {infra_pic}
                people="[People in charge of committee]"
                title="Infrastructure Committee: Together we make ACM function
                      by building cool projects such as this website"
            />
            <Committee 
                image= {infra_pic}
                people="[People in charge of committee]"
                title="Infrastructure Committee: Together we make ACM function
                      by building cool projects such as this website"
            />
            </ContentDiv>
        </Section>
    )
}

export default CommitteeSection