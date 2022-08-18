import styled from "styled-components"

const Container = styled.div`
    width: 900px;
    height: 350px;
    display: flex;
    border-top: 1px solid grey;
    @media screen and (max-width: 963px) {
        display: flex;
        max-width: 100%;
    }
`

const Imagediv = styled(Container)`
    width: 378px;
    height: 90%;
    padding: 24px 0;
    border-top: none;
    @media screen and (max-width: 963px) {
        display: none;
        max-width: 100%;
    }
`

const Image = styled.img`
    width: inherit;
    height: inherit;
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
`

const People = styled.p`
    text-transform: uppercase;
`

const Text = styled.h2`
    font-size: 22px;
    font-weight: 600;
    line-height: 30px;
    padding-top: 20px;
`

const Contact = styled.div`
    height: 150px;
    overflow: hidden;
    padding-top: 20px;
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
            <Text>
                {title}
            </Text>
            <Contact>
                <div>
                    <a href={contactinfo}>
                        {/*Contact the committee: {contactinfo}.*/}
                        {contactinfo}
                    </a>
                </div>
            </Contact>
            </div>
        </Contentdiv>
    </Container>
)

export default Committee