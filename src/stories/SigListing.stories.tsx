import { ComponentMeta, ComponentStory } from '@storybook/react'
import pwny8 from '../pwny8.svg'
import SigListing from './SigListing'

export default {
    title: 'Components/SigListing',
    component: SigListing,
} as ComponentMeta<typeof SigListing>;

const Template: ComponentStory<typeof SigListing> = args => <SigListing {...args} />;
    
export const Default = Template.bind({});
Default.args = {
    title: 'SIG Pwny',
    color: '#3c5',
    //color: '#283a2c',
    barcolor: "#84e899",
    paragraph1: "We're a student-run interest group and \
    CTF team at the University of Illinois at Urbana-Champaign \
    focused on information security. All are welcome! We have \
    a strong focus on kind and collaborative learning, because \
    we believe that it's the most fun to be excellent to each \
    other.\n\n We host weekly public meetings on low-barrier-of-entry \
    security topics that are focused on collaborative learning and \
    friendly environments. In addition, we run weekly seminars \
    weekly for more in-depth exploration in topics like embedded \
    device security, penetration testing, and fuzzing research. \
    We're proudest of our library of recorded meetings.\n\n \
    While we regularly place in CTF competitions, \
    we're a multidisciplinary club with students from many different \
    majors. This gives us a competitive edge that can't be beat!",
    paragraph2: "",
    Image: pwny8,
    link: "https://sigpwny.com/",
}

export const Copy = Template.bind({});
Copy.args = {
    title: 'SIG AIDA',
    color: '#51c0c0',
    //color: '#283a2c',
    barcolor: "#deffff",
    paragraph1: "We're a student-run interest group and \
    CTF team at the University of Illinois at Urbana-Champaign \
    focused on information security. All are welcome! We have \
    a strong focus on kind and collaborative learning, because \
    we believe that it's the most fun to be excellent to each \
    other.\n\n We host weekly public meetings on low-barrier-of-entry \
    security topics that are focused on collaborative learning and \
    friendly environments. In addition, we run weekly seminars \
    weekly for more in-depth exploration in topics like embedded \
    device security, penetration testing, and fuzzing research. \
    We're proudest of our library of recorded meetings.\n\n \
    While we regularly place in CTF competitions, \
    we're a multidisciplinary club with students from many different \
    majors. This gives us a competitive edge that can't be beat!",
    paragraph2: "",
    Image: "https://aida.acm.illinois.edu/static/adsa-logo-notext-9b02fdddd07f33d7ef3b4cd6a2e52ddb.png",
    link: "https://aida.acm.illinois.edu/",
}