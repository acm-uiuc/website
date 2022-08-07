import {
    Container,
    Image,
    Layout,
    MiddleText,
    Title,
    Description,
    LowerLayout,
    Link,
    Href,
    LinkPlaceholder,
} from './Card.styles'

interface CardProps {
    title: string
    description: string
    Imagesrc: string
    link1: string
    link2: string
    linktext1: string
    linktext2: string
}

export const Card = ({ 
    title, 
    description, 
    link1,
    link2, 
    linktext1, 
    linktext2, 
    Imagesrc 
}: CardProps) => (
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
                    <Href href={link1} target='_blank' rel='noreferrer'>
                        {linktext1}
                    </Href>
                </Link>
                <LinkPlaceholder>
                    <Href href={link2} target='_blank' rel='noreferrer'>
                        {linktext2}
                    </Href>
                </LinkPlaceholder>
            </LowerLayout>
        </Layout>
    </Container>
)

export default Card