import styled from "styled-components"

const Container = styled.div`
    height: fit-content;
    display: inline-flex;
    min-height: 560px;
    max-height: 600px;
    margin-top: 100px;
`

const SmallerContainer = styled.div`
    display: flex;
    height: 600px;
`

const SigLogo = styled.a`
    min-width: 230px;
    height: 250px;
    margin: 70px;
    justify-content: center;
    @media screen and (max-width: 1000px) {
        display: none;
    }
`

const ImageSrc = styled.img`
    &:hover {
        cursor: pointer;
        transition: transform 0.2s;
        transform: scale(1.05);
    }
`

const TitleTextLinks = styled.div`
    color: ${props => props.color};
    max-width: 570px;
    flex-direction: column;
`

const Title = styled.h1`
    font-weight: 500;
    font-family: sans-serif;
    font-size: 3.8rem;
`

const Text = styled.p`
    text-align: left;
    color: black;
    font-weight: 500;
    font-size: 18px;
    margin-bottom: 30px;
    line-height: 1.875rem;
    max-height: 600px;
    @media screen and (max-width: 560px) {
        width: 475px;
        margin-left: 10px;
    }
`

const ColDiv = styled.div`
    width: 300px;
    height: 500px;
    margin-top: 42px;
    @media screen and (max-width: 1200px) {
        display: none;
    }
`

const VerticalLine = styled.div`
    height: 95%;
    width: 0;
    border-left: 1px solid black;
    margin-left: 10px;
`

const ColText = styled.p`
    font-size: 18px;
    height: 100%;
    margin-left: 20px;
    margin-top: -370px;
`

const LinkDiv = styled(ColDiv)`
    height: 40px;
    width: inherit;
    margin-top: 100px;
    display: flex;
`

const Bar = styled.div`
    height: 70px;
    width: 770px;
    @media screen and (max-width: 1000px) {
        width: 570px;
    }
    @media screen and (max-width: 560px) {
        width: 475px;
    }
`

const Href = styled.a`
    display: inline-flex;
    background-color: transparent;
    cursor: pointer;
    text-decoration: none;
    font-family: "Roboto","Helvetica","Arial",sans-serif;
    font-size: 1rem;
    line-height: 1.75;
    letter-spacing: 0.02857em;
    text-transform: uppercase;
    padding: 4px 8px;
    background-image: linear-gradient(${props => props.color},${props => props.color});
    background-position: bottom;
    background-repeat: no-repeat;
    color: #1976d2;
    transition: all .4s ease-out;
    background-size: 0 1px;
    &:hover {
        background-size: 100% 1px;
    }
`

interface ListingProps {
    title: string
    paragraph1: string
    paragraph2: string
    Image: string
    link: string
    color: string
    barcolor: string
    chairs: string
    time: string
}

export const SigListing = ({
    title,
    paragraph1,
    paragraph2,
    Image,
    link,
    color,
    barcolor,
    chairs,
    time,
}: ListingProps) => (
    <Container>
        <SmallerContainer>
            <SigLogo href={link} target='_blank' rel='noreferrer'>
                <ImageSrc src={Image} />
            </SigLogo>
            <TitleTextLinks color={color}>
                <Title>
                    <a href={link} style={{color: "inherit", textDecoration: "none"}}>
                        {title}
                    </a>
                </Title>
                <Text>
                    {paragraph1}
                    <br />
                    <br />
                    {paragraph2}
                </Text>
                <Bar style={{backgroundColor: barcolor}}/>
            </TitleTextLinks>
            <ColDiv>
                <VerticalLine />
                <ColText>
                    SIG Chairs:
                    <br />
                    <br />
                    {chairs}
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    Meeting time:
                    <br/>
                    <br/>
                    {time}
                    <br/>
                    <LinkDiv>
                        <Href href="aad" target='_blank' rel='noreferrer' style={{marginRight: '0px'}} color={color}>
                            Website
                        </Href>
                        <Href href="aad" target='_blank' rel='noreferrer' color={color}>
                            Discord
                        </Href>
                        <Href href="aad" target='_blank' rel='noreferrer' style={{marginLeft: '0px'}} color={color}>
                            Email
                        </Href>
                    </LinkDiv>
                </ColText>
            </ColDiv>
        </SmallerContainer>
    </Container>    
)

export default SigListing