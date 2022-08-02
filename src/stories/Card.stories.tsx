import Card from "./Card";
import { storiesOf } from "@storybook/react";
import styled from "styled-components";

const Container = styled.div`
    max-width: 600px;
    height: 500px;
`

storiesOf('Card', module).add('Primary', () => (
    <Container>
        <Card />
    </Container>
    
))