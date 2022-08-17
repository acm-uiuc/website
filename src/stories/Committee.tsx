import styled from "styled-components"

const Container = styled.div`
    width: 1080px;
    height: 350px;
    display: flex;
    border-top: 1px solid grey;
`

const Imagediv = styled(Container)`
    width: 600px;
    height: 100%;
    padding: 24px 0;
    border-top: none;
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
                    <p>
                        Contact the committee: {contactinfo}. 
                    </p>
                </div>
            </Contact>
            </div>
        </Contentdiv>
    </Container>
)

export default Committee