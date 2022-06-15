import React, { FC, Fragment, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { SDK_PATH_PRODUCTION, SDK_PATH_SANDBOX, STANDARD_BUTTON_ASSET_PRODUCTION, STANDARD_BUTTON_ASSET_SANDBOX } from '../../utils';

export type VisaEvents = 'payment.success' | 'payment.cancel' | 'payment.error';

declare namespace V {
  function init(props: VisaCheckoutButtonProps | any): void;
  function on(event: VisaEvents, callback: Function): void;
}

export type CardBrands = 'VISA' | 'MASTERCARD' | 'AMEX' | 'DISCOVER' | 'ELECTRON' | 'ELO';

export interface VisaCheckoutThreeDSConfig {
  threeDSActive?: boolean; // default: true, set to false to disable 3DS
  threeDSSuppressChallenge?: boolean; // default: false, Whether a Verified by Visa (VbV) consumer authentication prompt is suppressed for this transaction. If true, VbV authentication is performed only when it is possible to do so without the consumer prompt.
}

export interface VisaCheckoutPaymentConfig {
  cardBrands?: CardBrands[];
  acceptCanadianVisaDebit?: boolean;
  billingCountries?: string[]; // ISO 3166-1 alpha-2 country codes. egc: ['US', 'CA']
}

export interface VisaCheckoutReviewConfig {
  message?: string; // The message to display on the review page. You are responsible for translating the message.
  buttonAction?: 'Continue' | 'Pay'; // The button action label to display on the review page. A valid value for total must be specified when using Pay on the button; otherwise Continue will be displayed.
}

export interface VisaCheckoutShippingConfig {
  acceptedRegions?: string[]; // ISO 3166-1 alpha-2 country codes. egc: ['US', 'CA']
  collectShipping?: boolean; // If true, the customer will be prompted to enter their shipping address.
}

export interface VisaCheckoutSettings {
  locale?: string; // The language and region in which the Visa Checkout lightbox should be displayed. egc. en_US
  countryCode?: string; // The country code of the country in which the Visa Checkout lightbox should be displayed. egc. US. The value of the country attribute must be compatible with the value of the locale attribute.
  displayName?: string; // The merchant's name as it appears on the Review panel of the lightbox; typically, it is the name of your company.
  websiteUrl?: string; // The URL of your website.
  customerSupportUrl?: string; // The URL of your company's customer support website.
  shipping?: VisaCheckoutShippingConfig; // Shipping properties associated with the lightbox
  review?: VisaCheckoutReviewConfig; // Review properties associated with the lightbox
  payment?: VisaCheckoutPaymentConfig; // Payment properties associated with the lightbox
  threeDSSetup?: VisaCheckoutThreeDSConfig; // ThreeDSSetup properties associated with the lightbox
  dataLevel?: 'SUMMARY' | 'FULL' | 'NONE'; // The data level to be used for the Visa Checkout lightbox.
  currencyFormat?: string; // The currency format to be used for the Visa Checkout lightbox. Refer to the currency format section on visa website for more information.
  enableUserDataPrefill?: boolean; // Whether to prefill the user data fields on the Visa Checkout lightbox. You must be enabled by Visa Checkout to use the prefill feature; contact Visa Checkout for more information.
}

export interface VisaCheckoutPaymentRequestSettings {
  merchantRequestId?: string;
  currencyCode?: string; // ISO 4217 (standard alpha-3 code values) currency code. The currency with which to process the transaction.
  subtotal?: number; // The total amount of the transaction, including all taxes, shipping, and other fees.
  shippingHandling?: number;
  tax?: number;
  discount?: number;
  giftWrap?: number; // The amount of the gift wrap fee.
  misc?: number; // Total uncategorized charges in the payment.
  total?: number;
  orderId?: string; // The order ID. Merchant's order ID associated with the payment.
  description?: string; // The description associated with the payment.
  promoCode?: string; // The promo code associated with the payment.
  customData?: {
    [key: string]: any;
  };
}

export interface VisaCheckoutButtonProps {
  apiKey: string; // The API key created with the Visa Checkout account. Use both a live key and a sandbox key, which are different from each other.
  encryptionKey: string; //  Visa Checkout encrypts data in the consumer information payload using the shared secret associated with this encryption key.
  subTotal: number; // Subtotal of the payment.
  currencyCode: string; // ISO 4217 currency code. The currency with which to process the transaction.
  collectShipping: boolean; // Require the customer to enter their shipping address.
  onSuccess: (payment: any) => void; // Callback function that is called when the payment is successful.
  onError: (payment: any, error: any) => void; // Callback function that is called when the payment fails.
  onCancel?: (payment: any) => void; // Callback function that is called when the payment is cancelled.
  sandbox?: boolean; // Whether or not to use the sandbox environment.
  settings?: VisaCheckoutSettings; // Visa Checkout settings.
  paymentRequest?: VisaCheckoutPaymentRequestSettings; // Visa Checkout payment request settings.
  displayMerchantName?: string; // The merchant's name as it appears on the Review panel of the lightbox; typically, it is the name of your company.
  shippingHandling?: number;
  tax?: number;
  discount?: number;
  referenceCallID?: string; // Alphanumeric; maximum 48 characters.
  externalProfileID?: string; // Alphanumeric; maximum 50 characters.
  externalClientId?: string; // Alphabetic, numeric, hyphens ( - ), and underscores ( _ ), e.g. spaces are not allowed; maximum 100 characters. Not required for merchants. For partners, it is the unique ID associated with a partner's client, such as the ID of a merchant onboarded by the partner. Typically, the external client ID is assigned by a partner; however, Visa Checkout assigns a value if one is not specified.
  buttonSize?: 154 | 213 | 425;
  buttonHeight?: 34 | 47 | 94;
  buttonWidth?: number;
  buttonColor?: 'standard' | 'neutral';
  buttonLocale?: string; // The language and region in which the Visa Checkout lightbox should be displayed. egc. en_US
  buttonCardBrands?: CardBrands[];
  buttonAcceptCanadianVisaDebit?: boolean;
  className?: string;
}

const VisaCheckoutButton: FC<VisaCheckoutButtonProps> = ({
  apiKey,
  encryptionKey,
  subTotal,
  currencyCode,
  collectShipping,
  onSuccess,
  onError,
  onCancel = (p) => console.log('payment.cancelled', p),
  sandbox = false,
  settings = {},
  paymentRequest = {},
  displayMerchantName = '',
  shippingHandling = 0,
  tax = 0,
  discount = 0,
  referenceCallID = '',
  externalProfileID = '',
  externalClientId = '',
  buttonSize,
  buttonHeight,
  buttonWidth,
  buttonColor = 'standard',
  buttonLocale = 'en_US',
  buttonCardBrands = ['VISA', 'MASTERCARD', 'DISCOVER', 'AMEX'],
  buttonAcceptCanadianVisaDebit = false,
  className = '',
}) => {
  useEffect(() => {
    // ** V will be defined once the the script (Visa SDK) is loaded.
    // ** This is a workaround for the fact that the script is not loaded in the regular dom.
    if (typeof V === 'undefined') {
      console.log('Visa Checkout SDK not loaded yet.');
      return;
    } else {
      console.log('Visa Checkout SDK loaded.', V);
      V.init({
        apiKey,
        encryptionKey,
        externalClientId,
        referenceCallID,
        externalProfileID,
        settings: {
          ...settings,
          displayName: displayMerchantName,
          shipping: {
            ...settings.shipping,
            collectShipping: collectShipping.toString(),
          },
        },
        paymentRequest: {
          ...paymentRequest,
          subtotal: Number(subTotal).toFixed(2),
          currencyCode: currencyCode.toUpperCase(),
          shippingHandling: Number(shippingHandling).toFixed(2),
          tax: Number(tax).toFixed(2),
          discount: Number(discount).toFixed(2),
        },
      });
    }
  }, [V]);

  // ** Register visa checkout event handlers.
  useEffect(() => {
    if (typeof V === 'undefined') {
      console.log('Visa Checkout SDK not loaded yet.');
      return;
    } else {
      V.on('payment.success', (payment: any) => {
        onSuccess(payment);
      });
      V.on('payment.error', (payment: any, error: any) => {
        onError(payment, error);
      });
      V.on('payment.cancel', (payment: any) => {
        onCancel(payment);
      });
    }
  }, [V]);

  // ** Helper to generate the button props
  const getButtonProps = () => {
    const buttonProps = {} as any;
    if (buttonSize) {
      buttonProps.size = buttonSize;
    }
    if (buttonHeight && !buttonSize) {
      buttonProps.height = buttonHeight;
    }
    if (buttonWidth && !buttonSize) {
      buttonProps.width = buttonWidth;
    }
    if (buttonColor) {
      buttonProps.color = buttonColor;
    }
    if (buttonLocale) {
      buttonProps.locale = buttonLocale;
    }
    if (buttonCardBrands) {
      buttonProps.cardBrands = buttonCardBrands.join(',');
    }
    if (buttonAcceptCanadianVisaDebit) {
      buttonProps.acceptCanadianVisaDebit = buttonAcceptCanadianVisaDebit.toString();
    }
    return buttonProps;
  };

  return (
    <Fragment>
      <Helmet>
        <head>
          <script type="text/javascript" src={sandbox ? SDK_PATH_SANDBOX : SDK_PATH_PRODUCTION}></script>
        </head>
      </Helmet>
      <img
        alt="Visa Checkout"
        className={`v-button ${className}`}
        role="button"
        {...getButtonProps()}
        src={sandbox ? STANDARD_BUTTON_ASSET_SANDBOX : STANDARD_BUTTON_ASSET_PRODUCTION}
      />
    </Fragment>
  );
};

export default VisaCheckoutButton;
