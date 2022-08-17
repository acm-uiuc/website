import styled from "styled-components"
import CommitteeSection from "../sections/about/CommitteeSection"
import Committee from "../stories/Committee"
import infra_pic from "../stories/assets/infra_pic.png"
import social from "../stories/assets/social.jpeg"

const Main = styled.main`
    width: 1100px;
    margin: 0 auto;
`

const About = () => {
    return (
        <Main>
            <CommitteeSection />
            <Committee image={infra_pic}
            people="[People in charge of committee]"
            title="Infrastructure Committee: Together we make ACM function
            by building cool projects such as this website"
            contactinfo="[insert email]"
            />
            <br/><br/><br/>
            <Committee image={social}
            people="[People in charge of committee]"
            title="Social Committee: The social team organizes fun events for
            ACM such as game nights, open house, and picnics!"
            contactinfo="[insert email]"
            />
        </Main>
    )
}

export default About