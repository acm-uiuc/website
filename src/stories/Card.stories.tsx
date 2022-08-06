import Card from "./Card";
import { storiesOf } from "@storybook/react";
import styled from "styled-components";
import pwny8 from '../pwny8.svg'

const Container = styled.div`
    width: 400px;
    height: 500px;
    display: grid;
    grid-gap: 40px;
    padding: 40px;
    grid-template-columns: repeat(auto-fill,minmax(280px,1fr));
    grid-auto-flow: column;
    grid-auto-columns: minmax(280px,1fr);
`

storiesOf('Components/Card', module).add('Primary', () => (
    <Container>
        <Card title="SIGPwny"
        description="A friendly but elite club focused on cybersecurity. They host 
                    weekly learning meetings and do CTFs and 
                    cutting-edge cybersecurity research."
        link="https://sigpwny.com/"
        Imagesrc={pwny8}
        linktext1="Website"
        linktext2="Discord"
        />
        <Card title="SIGPwny"
        description="A friendly but elite club focused on cybersecurity. They host 
                    weekly learning meetings and do CTFs and 
                    cutting-edge cybersecurity research."
        link="https://sigpwny.com/"
        Imagesrc={pwny8}
        linktext1="Website"
        linktext2="Discord"
        />
    </Container>
))