import Footer from "./Footer"
import { ComponentStory, ComponentMeta } from "@storybook/react";

export default {
    title: 'Components/Footer',
    component: Footer,
} as ComponentMeta<typeof Footer>

const Template: ComponentStory<typeof Footer> = args => <Footer />

export const Default = Template.bind({});