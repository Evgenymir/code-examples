import * as React from 'react';

export const useSubscriptionUserPagePopups = (setUserPayment) => {
  const [isPopupDeactivateUserShown, setIsPopupDeactivateUserShown] = React.useState(false);
  const [isPopupPaymentInfoShown, setIsPopupPaymentInfoShown] = React.useState(false);

  const handleDeactivatePopupToggle = React.useCallback(() => {
    setIsPopupDeactivateUserShown((prevState) => !prevState);
  }, [setIsPopupDeactivateUserShown]);
  const handlePaymentInfoPopupClose = React.useCallback(() => {
    setIsPopupPaymentInfoShown(false);
    setUserPayment(null);
  }, [setIsPopupDeactivateUserShown]);

  return {
    isPopupDeactivateUserShown,
    isPopupPaymentInfoShown,
    setIsPopupPaymentInfoShown,
    handleDeactivatePopupToggle,
    handlePaymentInfoPopupClose,
  };
};
