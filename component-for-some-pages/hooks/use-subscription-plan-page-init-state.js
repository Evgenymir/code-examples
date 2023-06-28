import * as React from 'react';
import { useSubscriptionPlan } from '../../../api/modules/account/use-subscription-plan';
import { useEmailSubscriptions } from '../../../api/modules/account/use-email-subscriptions';
import { SUBSCRIPTION_PLAN_PAGE_PER_PAGE } from '../helpers';
import { getSafeErrorMessageText } from '../../../helpers/get-safe-error-message-text';
import { consoleErrorMessage } from '../../../helpers/console-error-message';

export const useSubscriptionPlanPageInitState = (planId) => {
  const fetchSubscriptionPlan = useSubscriptionPlan();
  const fetchEmailSubscriptions = useEmailSubscriptions();

  const [searchText, setSearchText] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [reFetching, setReFetching] = React.useState(false);
  const [planData, setPlanData] = React.useState({});
  const [users, setUsers] = React.useState([]);
  const [usersCount, setUsersCount] = React.useState(null);
  const [usersApiError, serUsersApiError] = React.useState(null);
  const [isSubscriptionNotFound, setIsSubscriptionNotFound] = React.useState(false);

  const reFetchUsers = async (page = 1, email = null) => {
    setReFetching(true);
    const { data, status, errorMessage } = await fetchEmailSubscriptions({
      limit: SUBSCRIPTION_PLAN_PAGE_PER_PAGE,
      id: planId,
      page,
      email,
    });
    if (status === 200) {
      setUsers(data?.result ?? []);
      setUsersCount(data?.count ?? null);
      setReFetching(false);
    } else {
      const errorDataMessage = getSafeErrorMessageText(data?.errorData?.message);
      setUsers([]);
      setUsersCount(null);
      setReFetching(false);
      serUsersApiError(errorDataMessage);
      consoleErrorMessage(errorMessage, errorDataMessage, '/subscriptions');
    }
  };
  const init = async () => {
    setIsLoading(true);

    const [
      subscriptionPlanResponse,
      emailSubscriptionsResponse,
    ] = await Promise.allSettled([
      fetchSubscriptionPlan(planId),
      fetchEmailSubscriptions({
        limit: SUBSCRIPTION_PLAN_PAGE_PER_PAGE,
        id: planId,
      }),
    ]);

    const subscriptionPlanStatus = subscriptionPlanResponse?.value?.status ?? null;

    if (subscriptionPlanStatus === 200) {
      const subscriptionPlanData = subscriptionPlanResponse?.value?.data?.result ?? {};
      const emailSubscriptionsData = emailSubscriptionsResponse?.value?.data?.result ?? [];
      const emailSubscriptionsCount = emailSubscriptionsResponse?.value?.data?.count ?? null;
      setPlanData(subscriptionPlanData);
      setUsers(emailSubscriptionsData);
      setUsersCount(emailSubscriptionsCount);
    } else {
      setIsSubscriptionNotFound(true);
    }
    setIsLoading(false);
    setIsLoaded(true);
  };

  React.useEffect(() => {
    void init();
  }, []);

  return {
    isLoading,
    isLoaded,
    reFetching,
    planData,
    users,
    usersCount,
    usersApiError,
    reFetchUsers,
    isSubscriptionNotFound,
    searchText,
    setSearchText,
    page,
    setPage,
  };
};
