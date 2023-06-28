import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import { useUserSubscription } from '../../../api/modules/account/use-user-subscription';
import { useSubscriptionUserPayments } from '../../../api/modules/account/use-subscription-user-payments';
import { SUBSCRIPTION_USER_PAGE_PER_PAGE, getPaymentInfoItems } from '../helpers';
import { getSafeErrorMessageText } from '../../../helpers/get-safe-error-message-text';
import { consoleErrorMessage } from '../../../helpers/console-error-message';
import { currencyListSelector } from '../../../store/currencies/selectors';
import { useSubscriptionPlan } from '../../../api/modules/account/use-subscription-plan';

const ENDPOINT_NAME = '/subscriptions/:userid/payments';

export const useSubscriptionUserPageInitState = (userId, planId) => {
  const fetchSubscriptionPlan = useSubscriptionPlan();
  const fetchUserSubscription = useUserSubscription();
  const fetchSubscriptionUserPayments = useSubscriptionUserPayments();
  const currencyList = useSelector(currencyListSelector());

  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isFetching, setIsFetching] = React.useState(false);
  const [userData, setUserData] = React.useState({});
  const [subscriptionPlanData, setSubscriptionPlanData] = React.useState({});
  const [userPayment, setUserPayment] = React.useState(null);
  const [userPayments, setUserPayments] = React.useState([]);
  const [userPaymentsCount, setUserPaymentsCount] = React.useState(null);
  const [userPaymentsApiError, setUserPaymentsApiError] = React.useState(null);
  const [isUserNotFound, setIsUserNotFound] = React.useState(false);

  const userPaymentInfoItems = React.useMemo(() => (
    getPaymentInfoItems(userPayment, currencyList)
  ), [userPayment, currencyList]);

  const fetchUserPayments = async (page = 1, searchText = null, filterFormData = null) => {
    setIsFetching(true);
    const { data, status, errorMessage } = await fetchSubscriptionUserPayments(userId, {
      limit: SUBSCRIPTION_USER_PAGE_PER_PAGE,
      page,
      filter: searchText,
      status: filterFormData?.status,
      payinAddress: filterFormData?.payinAddress,
      payinHash: filterFormData?.payinHash,
      currency: filterFormData?.outcomeCurrency,
      dateFrom: filterFormData?.date?.from,
      dateTo: filterFormData?.date?.to,
    });

    if (status === 200) {
      ReactDOM.unstable_batchedUpdates(() => {
        setUserPayments(data?.result ?? []);
        setUserPaymentsCount(data?.count ?? null);
        setIsFetching(false);
      });
    } else {
      const errorDataMessage = getSafeErrorMessageText(data?.errorData?.message);
      ReactDOM.unstable_batchedUpdates(() => {
        setUserPayments([]);
        setUserPaymentsCount(null);
        setIsFetching(false);
        setUserPaymentsApiError(errorDataMessage);
      });
      consoleErrorMessage(errorMessage, errorDataMessage, ENDPOINT_NAME);
    }
  };
  const init = async () => {
    setIsLoading(true);
    const [
      userSubscriptionResponse,
      subscriptionPlanResponse,
      userPaymentsResponse,
    ] = await Promise.allSettled([
      fetchUserSubscription(userId),
      fetchSubscriptionPlan(planId),
      fetchSubscriptionUserPayments(userId, {
        limit: SUBSCRIPTION_USER_PAGE_PER_PAGE,
        page: 1,
      }),
    ]);

    const userSubscriptionStatus = userSubscriptionResponse?.value?.status ?? null;

    if (userSubscriptionStatus === 200) {
      const userSubscriptionData = userSubscriptionResponse?.value?.data?.result ?? {};
      const subscriptionPlanData = subscriptionPlanResponse?.value?.data?.result ?? {};
      const payments = userPaymentsResponse?.value?.data?.result ?? [];
      const paymentsCount = userPaymentsResponse?.value?.data?.count ?? null;
      const paymentsError = userPaymentsResponse?.value?.data?.errorData?.message ?? null;
      ReactDOM.unstable_batchedUpdates(() => {
        setUserData(userSubscriptionData);
        setSubscriptionPlanData(subscriptionPlanData);
        setUserPayments(payments);
        setUserPaymentsCount(paymentsCount);
        setUserPaymentsApiError(paymentsError);
        setIsLoading(false);
        setIsLoaded(true);
      });

      if (paymentsError) {
        const errorMessage = userPaymentsResponse?.value?.errorMessage;
        const errorDataMessage = getSafeErrorMessageText(userPaymentsResponse?.value?.data?.errorData?.message);
        consoleErrorMessage(errorMessage, errorDataMessage, ENDPOINT_NAME);
      }
    } else {
      ReactDOM.unstable_batchedUpdates(() => {
        setIsUserNotFound(true);
        setIsLoading(false);
        setIsLoaded(true);
      });
    }
  };

  React.useEffect(() => {
    void init();
  }, []);

  return {
    isLoading,
    isLoaded,
    isFetching,
    userData,
    subscriptionPlanData,
    userPayments,
    userPaymentsCount,
    userPaymentsApiError,
    isUserNotFound,
    fetchUserPayments,
    setUserPayment,
    userPaymentInfoItems,
  };
};
