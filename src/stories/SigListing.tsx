import styled from "styled-components"

const Container = styled.div`
    height: fit-content;
    width: 100%;
    display: inline-flex;
    min-height: 560px;
    margin-top: 100px;
`

const SmallerContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
`

const SigLogo = styled.a`
    width: 230px;
    margin: 70px;
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
    width: 570px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: fit-content;
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

`

const VerticalLineDiv = styled.div`
    width: 300px;
    margin-top: 170px;
    margin-bottom: 70px;
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

const LinkDiv = styled(VerticalLineDiv)`
    height: 40px;
    width: inherit;
    margin-top: 100px;
`

const Bar = styled.div`
    height: 70px;
    width: 770px;
    background-color: #84e899;
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
    padding: 4px 5px;
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
}

export const SigListing = ({
    title,
    paragraph1,
    paragraph2,
    Image,
    link,
    color,
    barcolor,
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
            <VerticalLineDiv>
                <VerticalLine />
                <ColText>
                    SIG Chairs:

                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    Meeting time:

                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <LinkDiv>
                    <Href href="aad" target='_blank' rel='noreferrer' style={{marginRight: '50px'}} color={color}>
                        link
                    </Href>
                    <Href href="aad" target='_blank' rel='noreferrer' color={color}>
                        link
                    </Href>
                    <Href href="aad" target='_blank' rel='noreferrer' style={{marginLeft: '50px'}} color={color}>
                        link
                    </Href>
                    </LinkDiv>
                </ColText>
            </VerticalLineDiv>
        </SmallerContainer>
    </Container>    
)

export default SigListing