import styled from 'styled-components';

interface CardProps {}

const Container = styled.article`
    background: #ffffff;
    box-shadow: 2px 2px 10px 5px rgba(0, 0, 0, 0.1);
    border-radius: 15px;
    display: flex;
    flex-direction: row;
`

const Card: React.FC<CardProps> = ({}) => (
    <Container>Card</Container>
)

export default Card