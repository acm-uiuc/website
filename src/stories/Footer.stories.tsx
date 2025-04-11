import Footer from '../components/Footer';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Components/Footer',
  component: Footer,
  decorators: [
    (
      Story, // mimics Footersection.tsx
    ) => (
      <div
        style={{ backgroundColor: '#333', color: 'white', textAlign: 'center' }}
      >
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof Footer>;

const Template: ComponentStory<typeof Footer> = (args) => <Footer />;

export const Default = Template.bind({});
