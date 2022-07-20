import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ButtonGroup } from './buttonGroup';

export default {
  title: 'ButtonGroup',
  component: ButtonGroup,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof ButtonGroup>;

const Template: ComponentStory<typeof ButtonGroup> = (args) => <ButtonGroup {...args} />;

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  user: {
    name: 'Jane Doe',
  },
};

export const LoggedOut = Template.bind({});
LoggedOut.args = {};
