import styled from "styled-components"

const Container = styled.div`
    height: fit-content;
    display: inline-flex;
    max-height: 600px;
    margin-top: 10px;
`

const SmallerContainer = styled.div`
    display: flex;
    height: 600px;
    max-width: 1220px;
    @media screen and (max-width: 1250px) {
        height: fit-content;
    }
`

const SigLogo = styled.a`
    min-width: 200px;
    height: 260px;
    margin: 70px;
    justify-content: center;
    @media screen and (max-width: 1000px) {
        display: none;
    }
`

const ImageSrc = styled.img`
    width: 200px;
    margin-top: 20px;
    &:hover {
        cursor: pointer;
        transition: transform 0.2s;
        transform: scale(1.05);
    }
`

const TitleText = styled.div`
    color: ${props => props.color};
    width: 580px;
    min-height: 500px;
    flex-direction: column;
    display: block;
    position: relative;
    @media screen and (max-width: 1250px) {
        min-height: 0;
        height: fit-content;
    }
`

const Title = styled.h1`
    font-weight: 500;
    font-family: sans-serif;
    font-size: 3.8rem;
    @media screen and (max-width: 560px) {
        width: 430px;
        margin-left: 30px;
    }
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
        width: 430px;
        margin-left: 30px;
    }
`

const ColDiv = styled.div`
    width: 280px;
    margin-left: 20px;
    height: 490px;
    margin-top: 110px;
    @media screen and (max-width: 1250px) {
        display: none;
    }
`

const VerticalLine = styled.div`
    border-left: 1px solid black;
    height: 450px;
    width: 0;
    margin-top: 50px;
    margin-left: 10px;
    @media screen and (max-width: 1250px) {
        display: none;
    }
`

const ColText = styled.p`
    font-size: 18px;
    margin-left: 0px;
`

const LinkDiv = styled(ColDiv)`
    height: 40px;
    width: inherit;
    margin-left: 0;
    margin-top: 100px;
    display: flex;
`

const Bar = styled.div`
    height: 70px;
    width: 770px;
    position: absolute;
    bottom: 0;
    @media screen and (max-width: 1250px) {
        width: 475px;
        position: relative;

    }
    @media screen and (max-width: 560px) {
        display: none;
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
    link2: string
    link3: string
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
    link2,
    link3,
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
            <TitleText color={color}>
                <Title>
                    <a href={link} style={{color: "inherit", textDecoration: "none"}}>
                        {title}
                    </a>
                </Title>
                <Text>
                    {paragraph1}
                    <br/><br/>
                    {paragraph2}
                </Text>
                <Bar style={{backgroundColor: barcolor}}/>
            </TitleText>
            <VerticalLine />
            <ColDiv>
                <ColText>
                    SIG Chairs:
                    <br/><br/>
                    {chairs}
                    <br/><br/><br/><br/><br/>
                    Meeting time:
                    <br/><br/>
                    {time}
                    <br/>
                    <LinkDiv> {/* This can be another story/component */}
                        <Href href={link} target='_blank' rel='noreferrer' color={color}>
                            Website
                        </Href>
                        <Href href={link2} target='_blank' rel='noreferrer' color={color}>
                            Discord
                        </Href>
                        <Href href={link3} target='_blank' rel='noreferrer' color={color}>
                            Email
                        </Href>
                    </LinkDiv>
                </ColText>
            </ColDiv>
        </SmallerContainer>
    </Container>    
)

export default SigListing