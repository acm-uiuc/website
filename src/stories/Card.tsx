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
    align-items: flex-start;
    padding: 16px;
`


interface CardProps {

}

const Card: React.FC<CardProps> = ({ }) => (
    <Container>
        <Image src='https://sigpwny.com/images/logo.png' />
        <Layout>
            CARD
        </Layout>
    </Container>
)

export default Card