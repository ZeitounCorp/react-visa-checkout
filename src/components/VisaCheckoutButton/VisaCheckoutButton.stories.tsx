import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import VisaCheckoutButton from './VisaCheckoutButton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'ReactVisaCheckoutWrapper/VisaCheckoutButton',
  component: VisaCheckoutButton,
} as ComponentMeta<typeof VisaCheckoutButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof VisaCheckoutButton> = (args) => <VisaCheckoutButton {...args} />;

export const VisaCheckoutExample = Template.bind({});
VisaCheckoutExample.args = {
  apiKey: 'ABC',
  encryptionKey: 'DEF',
  collectShipping: false,
  currencyCode: 'USD',
  subTotal: 100,
  sandbox: true,
  onError: (p: any, e: any) => console.log(p, e),
  onSuccess: (p: any) => console.log(p),
};
