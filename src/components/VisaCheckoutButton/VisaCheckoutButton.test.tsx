import * as React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import VisaCheckoutButton from './VisaCheckoutButton';

describe('VisaCheckoutButton', () => {
  test('renders the VisaCheckoutButton component', () => {
    render(
      <VisaCheckoutButton
        apiKey="Your_API_Key"
        encryptionKey="Your_Encryption_Key"
        collectShipping={false}
        currencyCode={'USD'}
        sandbox={true}
        subTotal={100}
        onError={(p: any, e: any) => console.log(p, e)}
        onSuccess={(p: any) => console.log(p)}
      />
    );
  });
});
