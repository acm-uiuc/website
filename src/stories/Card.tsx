import styled from 'styled-components';

const Container = styled.article`
    background: #ffffff;
    box-shadow: 2px 2px 10px 5px rgba(0, 0, 0, 0.1);
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 450px;
    background-color: #ededed;
`

const Image = styled.img`
    height: 150px;
    object-fit: contain;
    width: 100%;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
`

const Layout = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
    justify-content: space-between;
    height: 100%;
`

const MiddleText = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0;
    align-items: center;
`

const Title = styled.h2`
    font-family: Inter;
    font-weight: 600;
    line-height: 22px;
    margin: 0px;
    padding-bottom: 10px;
`

const Description = styled.p`
    font-size: 14px;
    line-height: 24px;
    margin: 0px;
    color: #9c9c9c;
`

const LowerLayout = styled.div`
`

const Link = styled.span`
    border-radius: 12px;
    color: blue;
    line-height: 20px;
    font-size: 14px;
`

const Href = styled.a`
    display: inline-flex;
    background-color: transparent;
    cursor: pointer;
    text-decoration: none;
    font-family: "Roboto","Helvetica","Arial",sans-serif;
    line-height: 1.75;
    padding: 5px 15px;
    border-radius: 8px;
    color: #1976d2;
    border: 1px solid #1976d2;
    transition: all 0.4s ease;
    &:hover {
        transform: translateY(-2px);
        background-color: rgba(25, 118, 210, 0.04);
        border: 1px solid #1976d2;
    }
`

const LinkPlaceholder = styled.div`
    display: flex;
    flex-direction: row;
    padding-top: 16px;
`

interface CardProps {
    title: string
    description: string
    link: string
    Imagesrc: string
    linktext: string
}

const Card: React.FC<CardProps> = ({ title, description, link, linktext, Imagesrc }) => (
    <Container>
        <Image src={Imagesrc} />
        <Layout>
            <MiddleText>
                <Title>
                    {title}
                </Title>
                <Description>
                    {description}
                </Description>
            </MiddleText>
            <LowerLayout>
                <Link>
                    <Href href={link} target='_blank' rel='noreferrer'>
                        {linktext}
                    </Href>
                </Link>
                <LinkPlaceholder>
                    LinkPlaceholder
                </LinkPlaceholder>
            </LowerLayout>
        </Layout>
    </Container>
)

export default Card