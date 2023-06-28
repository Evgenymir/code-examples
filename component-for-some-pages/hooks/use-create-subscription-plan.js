import * as React from 'react';
import { safeToLowerCase } from '../../../helpers/safe-to-lower-case';
import { getPeriodDays } from '../helpers';
import { getSafeErrorMessageText } from '../../../helpers/get-safe-error-message-text';
import { useCreateSubscriptionsPlan } from '../../../api/modules/account/use-create-subscriptions-plan';

export const useCreateSubscriptionPlan = (refetch, setPage, setIsPopupShown) => {
  const fetchCreateSubscriptionsPlan = useCreateSubscriptionsPlan();

  const [createPlanFetching, setCreatePlanFetching] = React.useState(false);
  const [createPlanError, setCreatePlanError] = React.useState(null);

  const handleCreateSubscriptionPlanSubmit = async (formData) => {
    const periodNumber = Number(formData.period);
    const periodSelectText = formData.periodSelect;
    const periodSelectTextLowerCased = safeToLowerCase(periodSelectText);
    const periodDays = String(getPeriodDays(periodNumber, periodSelectTextLowerCased));

    setCreatePlanFetching(true);
    const { data, status } = await fetchCreateSubscriptionsPlan({ ...formData, periodDays });

    if (status === 201) {
      await refetch();
      setPage(1);
      setCreatePlanFetching(false);
      setIsPopupShown(false);
    } else {
      const errorMessage = getSafeErrorMessageText(data?.errorData?.message);
      setCreatePlanError(errorMessage);
      setCreatePlanFetching(false);
    }
  };

  React.useEffect(() => {
    let nextTimerId = null;
    if (createPlanError) {
      nextTimerId = setTimeout(() => {
        setCreatePlanError(null);
      }, 3000);
    }

    return () => clearTimeout(nextTimerId);
  }, [createPlanError]);

  return {
    createPlanFetching,
    createPlanError,
    handleCreateSubscriptionPlanSubmit,
  };
};
