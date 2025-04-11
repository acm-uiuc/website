import { ComponentMeta, ComponentStory } from '@storybook/react';
import Sigscard from './Sigscard';
import * as CardStories from '../../stories/Card.stories';
import { IOrgData } from '@/utils/organizations';

export default {
  title: 'Sections/Sigscard',
  component: Sigscard,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Sigscard>;

const Template: ComponentStory<typeof Sigscard> = (args) => (
  <Sigscard {...args} />
);

export const Default = Template.bind({});
Default.args = {
  sigs: [{ ...(CardStories.SIGPwny.args as IOrgData) }],
  eventsLoading: false,
  upcomingEvents: [],
};
