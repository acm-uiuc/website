import Card from "./Card";
import pwny8 from '../pwny8.svg'
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
    Imagesrc: pwny8,
    linktext1: "Website",
    linktext2: "Discord"
}
export const SIGAIDA = Template.bind({});
SIGAIDA.args = { 
    title: "SIGAIDA",
    description: "We are the premier data science organization at the University of Illinois.",
    link1: "https://aida.acm.illinois.edu/",
    link2: "https://discord.gg/GEMh8umbe7",
    Imagesrc: "https://aida.acm.illinois.edu/static/adsa-logo-notext-9b02fdddd07f33d7ef3b4cd6a2e52ddb.png",
    linktext1: "Website",
    linktext2: "Discord"
}
export const SIGMobile = Template.bind({});
SIGMobile.args = { 
    title: "SIGMobile",
    description: "Special Interest Group for Mobile Development.",
    link1: "http://github.com/SIGMobileUIUC",
    link2: "https://discord.gg/WN7pRp5PmW",
    Imagesrc: "https://avatars.githubusercontent.com/u/11053426?s=200&v=4",
    linktext1: "Github",
    linktext2: "Discord"
}