import styled from "styled-components"
import Text from '../components/Text/Text';

const Container = styled.div`
    width: 900px;
    height: 350px;
    display: flex;
    border-top: 1px solid grey;
    @media screen and (max-width: 963px) {
        max-width: 100%;
        height: fit-content;
        display: block;
    }
`

const Imagediv = styled(Container)`
    width: 378px;
    height: 90%;
    padding: 24px 0;
    border-top: none;
    @media screen and (max-width: 963px) {
        padding: 12px 0;
    }
`

const Image = styled.img`
    width: inherit;
    height: inherit;
    @media screen and (max-width: 963px) {
        height: 400px;
    }
`

const Contentdiv = styled(Container)`
    display: flex;
    flex: 1 1 50%;
    flex-direction: column;
    justify-content: space-between;
    width: 50%;
    padding: 50px;
    border-top: none;
    text-align: left;
    @media screen and (max-width: 963px) {
        height: fit-content;
        width: 100%;
        padding: 0;
    }
`

const People = styled.p`
    text-transform: uppercase;
    @media screen and (max-width: 963px) {
        display: none;
    }
`

const Description = styled(Text)`
    font-size: 20px;
    line-height: 30px;
    padding-top: 20px;
    @media screen and (max-width: 963px) {
        padding-top: 0;
    }
`

const Contact = styled.div`
    height: 150px;
    overflow: hidden;
    padding-top: 20px;
    @media screen and (max-width: 963px) {
        display: none;
    }
`

interface CommitteeProps {
    people: string
    contactinfo: string
    title: string
    image: string
}

export const Committee = ({
    people,
    contactinfo,
    title,
    image,
}: CommitteeProps) => (
    <Container>
        <Imagediv>
            <Image src={image} />
        </Imagediv>
        <Contentdiv>
            <div>
            <People>
                {people}
            </People>
            <Description>
                {title}
            </Description>
            <Contact>
                <div>
                    <p>
                        {/*Contact the committee: {contactinfo}.*/}
                        {contactinfo}
                    </p>
                </div>
            </Contact>
            </div>
        </Contentdiv>
    </Container>
)

export default Committee