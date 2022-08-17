import { ComponentMeta, ComponentStory } from "@storybook/react"
import Committee from "./Committee"
import infra_pic from "../stories/assets/infra_pic.png"
import social from "../stories/assets/social.jpeg"

export default {
    title: 'Components/Committee',
    component: Committee,
} as ComponentMeta<typeof Committee>

const Template: ComponentStory<typeof Committee> = args => <Committee {...args} />

export const Default = Template.bind({})
Default.args = {
    image: infra_pic,
    people: "[People in charge of committee]",
    title: "Infrastructure Committee: Together we make ACM function \
    by building cool projects such as this website",
    contactinfo: "[insert email]"
}
export const Copy = Template.bind({})
Copy.args = {
    image: social,
    people: "[People in charge of committee]",
    title: "Social Committee: The social team organizes fun events for \
    ACM such as ...!",
    contactinfo: "[insert email]"
}