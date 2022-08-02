import Card from "./Card";
import { storiesOf } from "@storybook/react";
import styled from "styled-components";

const Container = styled.div`
    width: 400px;
    height: 500px;
`

storiesOf('Components/Card', module).add('Primary', () => (
    <Container>
        <Card title="SIGPwny" 
        description="SIGPwny is a friendly but elite club focused on cybersecurity. They host 
                    weekly learning meetings, participate in CTFs, and do 
                    cutting-edge cybersecurity research."
        link="https://sigpwny.com/"
        Imagesrc="https://sigpwny.com/images/logo.png"
        />
    </Container>
    
))