import Card from "../components/Card/Card";
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
    links: [
        {
            link: "https://sigpwny.com/",
            text: "Website"
        },
        {
            link: "https://sigpwny.com/discord",
            text: "Discord"
        }
    ]
}
export const SIGAIDA = Template.bind({});
SIGAIDA.args = { 
    title: "SIGAIDA",
    description: "We are the premier data science organization at the University of Illinois.",
    links: [
        {
            link: "https://aida.acm.illinois.edu/",
            text: "Website"
        },
        {
            link: "https://discord.gg/GEMh8umbe7",
            text: "Discord"
        }
    ]
}
export const SIGMobile = Template.bind({});
SIGMobile.args = { 
    title: "SIGMobile",
    description: "Special Interest Group for Mobile Development.",
    links: [
        {
            link: "http://github.com/SIGMobileUIUC",
            text: "Github"
        },
        {
            link: "https://discord.gg/WN7pRp5PmW",
            text: "Discord"
        }
    ]
}