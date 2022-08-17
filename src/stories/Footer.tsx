import styled from "styled-components"

const Container = styled.div`
    height: 200px;
    background-color: #333;
    color: white;
    position: relative;
    margin-top: 40px;
`

const FooterContainer = styled.div`
    display: flex;
`

const AllContent = styled.div`
    width: 100%;
    height: 100%;
`

const Title = styled.h2`
    font-size: 20px;
    font-weight: 650;
    padding-top: 10px;
`

const ExternalLinkDiv = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`

const SingleLinkDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 250px;
    height: 50px;
    margin: 15px 5px;
`

const Href = styled.a`
    cursor: pointer;
    text-decoration: none;
    font-family: "Roboto","Helvetica","Arial",sans-serif;
    font-weight: 1000;
    font-size: 1rem;
    letter-spacing: 0.02857em;
    text-transform: uppercase;
    color: white;
    &:hover {
        color: #b6b5b5;
    }
`

const Copyright = styled.h5``

export const Footer = () => (
    <Container>
        <FooterContainer>
            <AllContent>
                <Title>Connect with ACM @ UIUC</Title>
                <ExternalLinkDiv>
                    <SingleLinkDiv>
                        <Href href="https://discord.gg/strhfywPdw" target='_blank' rel='noreferrer'>
                            Discord
                        </Href>
                    </SingleLinkDiv>
                    <SingleLinkDiv>
                        <Href href="https://www.facebook.com/acmuiuc" target='_blank' rel='noreferrer'>
                            Facebook
                        </Href>
                    </SingleLinkDiv>
                    <SingleLinkDiv>
                        <Href href="https://twitter.com/acmuiuc" target='_blank' rel='noreferrer'>
                            Twitter
                        </Href>
                    </SingleLinkDiv>
                    <SingleLinkDiv>
                        <Href href="https://github.com/acm-uiuc" target='_blank' rel='noreferrer'>
                            Github
                        </Href>
                    </SingleLinkDiv>
                    <SingleLinkDiv>
                        <Href href="https://acm-uiuc.slack.com/" target='_blank' rel='noreferrer'>
                            Slack
                        </Href>
                    </SingleLinkDiv>
                </ExternalLinkDiv>
            </AllContent>
        </FooterContainer>
        <Copyright>© {new Date().getFullYear()} ACM</Copyright>
    </Container>
)

export default Footer