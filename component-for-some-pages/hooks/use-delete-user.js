import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { getSafeErrorMessageText } from '../../../helpers/get-safe-error-message-text';
import { useDeleteUserSubscription } from '../../../api/modules/account/use-delete-user-subscription';

export const useDeleteUser = (userId, planId) => {
  const history = useHistory();
  const fetchDeleteUserSubscription = useDeleteUserSubscription();

  const [deleteUserPending, setDeleteUserPending] = React.useState(false);
  const [deleteUserError, setDeleteUserError] = React.useState(null);

  const handleDeleteUser = async () => {
    setDeleteUserPending(true);
    const { status, data } = await fetchDeleteUserSubscription(userId);
    setDeleteUserPending(false);

    if (status === 200) {
      history.replace(`${ROUTES.SUBSCRIPTIONS}/${planId}`);
    } else {
      const errorMessage = getSafeErrorMessageText(data?.errorData?.message);
      setDeleteUserError(errorMessage);
    }
  };

  React.useEffect(() => {
    let timerId = null;
    if (deleteUserError) {
      timerId = setTimeout(() => {
        setDeleteUserError(null);
      }, 3000);
    }

    return () => clearTimeout(timerId);
  }, [deleteUserError]);

  return {
    deleteUserPending,
    deleteUserError,
    handleDeleteUser,
  };
};
