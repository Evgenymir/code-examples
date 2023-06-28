import * as React from 'react';
import { checkEmails } from '../helpers';
import { getSafeErrorMessageText } from '../../../helpers/get-safe-error-message-text';
import { useCreateEmailSubscription } from '../../../api/modules/account/use-create-email-subscription';

const MAX_EMAILS = 10;
const TIMER_TIMEOUT = 4000;
export const useCreateUsersToSubscribe = (planId) => {
  const fetchCreateEmailSubscription = useCreateEmailSubscription();

  const [createUsersError, setCreateUsersError] = React.useState(null);
  const [createUsersApiError, setCreateUsersApiError] = React.useState(null);
  const [createUsersPending, setCreateUsersPending] = React.useState(false);
  const [createUsersSuccess, setCreateUsersSuccess] = React.useState(false);
  const [isPopupCreateUsersShown, setIsPopupCreateUsersShown] = React.useState(false);

  const handleCreateUsersSubmit = async (emails) => {
    setCreateUsersError(null);

    if (!emails) {
      setCreateUsersError('User emails is required field');

      return false;
    }

    const emailsArray = emails.split(',').map((item) => item.trim());
    const oneEmail = emailsArray.length === 1 ? emailsArray.join('') : null;
    const { isValid, error } = checkEmails(emailsArray, MAX_EMAILS);

    if (!isValid) {
      setCreateUsersError(error);

      return;
    }

    setCreateUsersPending(true);
    const { data, status } = await fetchCreateEmailSubscription({
      email: oneEmail || emailsArray,
      subscriptionPlanId: planId,
    });

    if (status === 201) {
      setCreateUsersPending(false);
      setIsPopupCreateUsersShown(false);
      setCreateUsersSuccess(true);
    } else {
      const errorMessage = getSafeErrorMessageText(data?.errorData?.message);
      setCreateUsersApiError(errorMessage);
      setCreateUsersPending(false);
    }
  };

  React.useEffect(() => {
    let errorTimerId = null;
    let errorApiTimerId = null;
    if (createUsersError) {
      errorTimerId = setTimeout(() => {
        setCreateUsersError(null);
      }, TIMER_TIMEOUT);
    }
    if (createUsersApiError) {
      errorApiTimerId = setTimeout(() => {
        setCreateUsersApiError(null);
      }, TIMER_TIMEOUT);
    }

    return () => {
      clearTimeout(errorTimerId);
      clearTimeout(errorApiTimerId);
    };
  }, [createUsersError, createUsersApiError]);

  React.useEffect(() => {
    let timerId = null;
    if (createUsersSuccess) {
      timerId = setTimeout(() => {
        setCreateUsersSuccess(false);
      }, TIMER_TIMEOUT);
    }

    return () => clearTimeout(timerId);
  }, [createUsersSuccess]);

  return {
    isPopupCreateUsersShown,
    setIsPopupCreateUsersShown,
    createUsersPending,
    createUsersError,
    createUsersApiError,
    createUsersSuccess,
    handleCreateUsersSubmit,
  };
};
