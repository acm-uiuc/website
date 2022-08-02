import styled from 'styled-components';

const Container = styled.article`
    background: #ffffff;
    box-shadow: 2px 2px 10px 5px rgba(0, 0, 0, 0.1);
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 400px;
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
    align-items: center;
    padding: 16px;
`

const MiddleText = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0;
    align-items: flex-start;
`

const Title = styled.h2`
    font-family: Inter;
    font-weight: 600;
    line-height: 22px;
    margin: 0px;
    padding-bottom: 10px;
`


interface CardProps {
    title: string
}

const Card: React.FC<CardProps> = ({ title }) => (
    <Container>
        <Image src='https://sigpwny.com/images/logo.png' />
        <Layout>
            <MiddleText>
                <Title>
                    {title}
                </Title>
            </MiddleText>
        </Layout>
    </Container>
)

export default Card