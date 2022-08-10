import styled from "styled-components"

const Container = styled.article`
    height: 600px;
    width: 100%;
    display: inline-flex;
    min-height: 560px;
    margin-top: 100px;
    justify-content: center;
`

const SigLogo = styled.a`
    width: 200px;
    position: relative;
`

const Imagesrc = styled.img`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    &:hover {
        cursor: pointer;
        transition: transform 0.2s;
        transform: scale(1.05);
    }
`

const TitleDescriptionAndLinks = styled.div`
    color: ${props => props.color};
    max-width: 570px;
    text-align: left;
    display: block;
    margin-left: 100px;
    margin-right: 100px;
`

const Title = styled.h1`
    margin: 0px;
    font-family: sans-serif;
    font-size: 4rem;
    text-align: center;
`

const Description = styled.p`
    white-space: pre-line;
    font-size: 1.25rem;
    font-family: "Basetica Light",serif;
    color: black;
    margin-top: 40px;
    line-height: 1.875rem;
    font-weight: 500;
`

const Bar = styled.div`
    height: 70px;
    width: 770px;
    background-color: #84e899;
`

interface ListingProps {
    title: string
    description: string
    Image: string
    link: string
    color: string
    p2: string
    barcolor: string
}

export const SigListing = ({
    title,
    description,
    p2,
    Image,
    link,
    color,
    barcolor,
}: ListingProps) => (
    <Container>
        <SigLogo href={link} target='_blank' rel='noreferrer'>
            <Imagesrc src={Image} />
        </SigLogo>
         <TitleDescriptionAndLinks color={color}>
            <Title>
                <a href={link} style={{color: "inherit", textDecoration: "none"}}>{title}</a>
           </Title>
           <Description>
                {description}
                <br />
                <br />
                {p2}
           </Description>
           <Bar style={{backgroundColor: barcolor}}/>
        </TitleDescriptionAndLinks>
        <SigLogo href={link} target='_blank' rel='noreferrer'>
            <Imagesrc src={Image} />
        </SigLogo>
    </Container>
)

export default SigListing