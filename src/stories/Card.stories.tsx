import Card from "./Card";
import { storiesOf } from "@storybook/react";
import styled from "styled-components";

const Container = styled.div`
    width: 400px;
    height: 500px;
`

storiesOf('Components/Card', module).add('Primary', () => (
    <Container>
        <Card />
    </Container>
    
))