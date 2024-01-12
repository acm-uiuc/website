import Card from "../components/Card/Card";
import pwny8 from '../stories/assets/pwny8.svg';
import sigaida from '../stories/assets/sigaidalogo.png';
import sigmobile from '../stories/assets/sigmobile.png';
import { ComponentStory, ComponentMeta } from "@storybook/react";

export default {
    title: 'Components/Card',
    component: Card,
} as ComponentMeta<typeof Card>;

const Template: ComponentStory<typeof Card> = args => <Card {...args} />;

export const SIGPwny = Template.bind({});
SIGPwny.args = { 
    title: "SIGPwny",
    description: "A friendly but elite club focused on cybersecurity. They host weekly learning meetings and do CTFs and cutting-edge cybersecurity research.",
    link1: "https://sigpwny.com/",
    link2: "https://sigpwny.com/discord",
    img: pwny8,
    linktext1: "Website",
    linktext2: "Discord"
}
export const SIGAIDA = Template.bind({});
SIGAIDA.args = { 
    title: "SIGAIDA",
    description: "We are the premier data science organization at the University of Illinois.",
    link1: "https://aida.acm.illinois.edu/",
    link2: "https://discord.gg/GEMh8umbe7",
    img: sigaida,
    linktext1: "Website",
    linktext2: "Discord"
}
export const SIGMobile = Template.bind({});
SIGMobile.args = { 
    title: "SIGMobile",
    description: "Special Interest Group for Mobile Development.",
    link1: "http://github.com/SIGMobileUIUC",
    link2: "https://discord.gg/WN7pRp5PmW",
    img: sigmobile,
    linktext1: "Github",
    linktext2: "Discord"
}