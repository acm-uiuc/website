import { ComponentMeta, ComponentStory } from "@storybook/react"
import Card from "../../stories/Card"
import Sigs from "./Sigs"
import * as CardStories from '../../stories/Card.stories'
import pwny8 from '../pwny8.svg'

export default {
    title: 'Sections/Sigs',
    component: Sigs,
    parameters: {
        layout: 'fullscreen',
    },
} as ComponentMeta<typeof Sigs>;


const Template: ComponentStory<typeof Sigs> = (args) => <Sigs {...args} />;

export const Default = Template.bind({});
Default.args = {
    sigs: [
        {...CardStories.SIGPwny.args}
    ]
}

/*
export const SigsSection: ComponentStory<typeof Sigs> = () => (
    <Sigs>
        <CardStories.SIGPwny 
        title="SIGPwny" 
          description="A friendly but elite club focused on cybersecurity. They host 
                      weekly learning meetings, participate in CTFs, and do 
                      cutting-edge cybersecurity research."
          link1="https://sigpwny.com/"
          link2="https://sigpwny.com/discord"
          Imagesrc={pwny8}
          linktext1="Website" 
linktext2="Discord"/>
    <CardStories.SIGPwny 
    title="SIGPwny" 
    description="A friendly but elite club focused on cybersecurity. They host 
                weekly learning meetings, participate in CTFs, and do 
                cutting-edge cybersecurity research."
    link1="https://sigpwny.com/"
    link2="https://sigpwny.com/discord"
    Imagesrc={pwny8}
    linktext1="Website" 
linktext2="Discord"
    {...CardStories.SIGPwny.args} />
    </Sigs>
)
*/