import {
    Container,
    Image,
    Layout,
    MiddleText,
    Title,
    Description,
    LowerLayout,
    LinkLeft,
    Href,
    LinkRight,
} from './Card.styles';

interface CardProps {
    title: string
    description: string
    Imagesrc: string
    Imagefallbacksrc?: string
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
    Imagesrc,
    Imagefallbacksrc
}: CardProps) => (
    <Container>
        <Image alt={title + " Logo"} loading="lazy" src={Imagesrc} onError={({ currentTarget }: {currentTarget: any}) => { currentTarget.onerror = null; currentTarget.src = Imagefallbacksrc }}/>
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
                <LinkLeft>
                    <Href href={link1}>
                        {linktext1}
                    </Href>
                </LinkLeft>
                <LinkRight>
                    <Href href={link2}>
                        {linktext2}
                    </Href>
                </LinkRight>
            </LowerLayout>
        </Layout>
    </Container>
);

export default Card;