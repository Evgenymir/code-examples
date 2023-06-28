import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import { initialState } from '../../../store/payment-settings/initial-state';
import {
  setApiKeys,
  setApiKeysFetched,
  setBaseCurrency,
  setBaseCurrencyFetched,
  setHasActiveApiKey,
  setPaymentSettingsFetching,
} from '../../../store/payment-settings/reducer';
import { hasActiveApiKey } from '../../../helpers/has-active-api-key';
import {
  setSubscriptionsError,
  setSubscriptionsFetched,
  setSubscriptionsFetching,
  setSubscriptionsPlans,
  setSubscriptionsPlansCount,
} from '../../../store/subscriptions/reducer';
import { hasElementsInArray } from '../../../helpers/has-elements-in-array';
import { useApiKeys } from '../../../api/modules/account/use-api-keys';
import { useBaseCurrency } from '../../../api/modules/account/use-base-currency';
import { useSubscriptionsPlans } from '../../../api/modules/account/use-subscriptions-plans';
import { partnerFetchedSelector } from '../../../store/partner/selectors';
import {
  apiKeysFetchedSelector,
  baseCurrencyFetchedSelector,
} from '../../../store/payment-settings/selectors';
import { SUBSCRIPTIONS_PAGE_PER_PAGE } from '../helpers';
import { subscriptionPlansFetchingSelector } from '../../../store/subscriptions/selectors';
import { getSafeErrorMessageText } from '../../../helpers/get-safe-error-message-text';
import { consoleErrorMessage } from '../../../helpers/console-error-message';

export const useSubscriptionsPageInitState = () => {
  const dispatch = useDispatch();
  const fetchApiKeys = useApiKeys();
  const fetchBaseCurrency = useBaseCurrency();
  const fetchSubscriptionsPlans = useSubscriptionsPlans();
  const partnerFetched = useSelector(partnerFetchedSelector());
  const apiKeysFetched = useSelector(apiKeysFetchedSelector());
  const baseCurrencyFetched = useSelector(baseCurrencyFetchedSelector());
  const subscriptionPlansFetching = useSelector(subscriptionPlansFetchingSelector());

  const [isLoading, setIsLoading] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [page, setPage] = React.useState(1);

  const getBaseCurrency = async () => {
    const { data, status } = await fetchBaseCurrency();

    if (status === 200) {
      return data?.baseCurrency ?? initialState.baseCurrency;
    }

    return initialState.baseCurrency;
  };
  const getApiKeys = async () => {
    const { data, status } = await fetchApiKeys();

    if (status === 200 && hasElementsInArray(data?.keys)) {
      return data.keys;

    }

    return [];
  };
  const updateApiKeys = async () => {
    dispatch(setPaymentSettingsFetching(true));
    const { data, status } = await fetchApiKeys();

    if (status === 200 && hasElementsInArray(data?.keys)) {
      ReactDOM.unstable_batchedUpdates(() => {
        dispatch(setApiKeys(data.keys));
        dispatch(setHasActiveApiKey(hasActiveApiKey(data.keys)));
        dispatch(setApiKeysFetched(true));
        dispatch(setPaymentSettingsFetching(false));
      });
    } else {
      dispatch(setPaymentSettingsFetching(false));
    }
  };
  const fetchSubscriptionPlans = async (page = 1, filter = null) => {
    ReactDOM.unstable_batchedUpdates(() => {
      dispatch(setSubscriptionsError(null));
      dispatch(setSubscriptionsFetching(true));
    });
    const { data, status, errorMessage } = await fetchSubscriptionsPlans({
      limit: SUBSCRIPTIONS_PAGE_PER_PAGE,
      page,
      filter,
    });

    if (status === 200) {
      ReactDOM.unstable_batchedUpdates(() => {
        dispatch(setSubscriptionsPlans(data?.result ?? []));
        dispatch(setSubscriptionsPlansCount(data?.count ?? 0));
        dispatch(setSubscriptionsFetching(false));
      });
    } else {
      const errorDataMessage = getSafeErrorMessageText(data?.errorData?.message);
      ReactDOM.unstable_batchedUpdates(() => {
        dispatch(setSubscriptionsPlans([]));
        dispatch(setSubscriptionsPlansCount(null));
        dispatch(setSubscriptionsFetching(false));
        dispatch(setSubscriptionsError(errorDataMessage));
      });
      consoleErrorMessage(errorMessage, errorDataMessage, '/subscriptions/plans');
    }
  };
  const getSubscriptionPlans = async () => {
    const { data, status } = await fetchSubscriptionsPlans({
      limit: SUBSCRIPTIONS_PAGE_PER_PAGE,
      page: 1,
    });

    if (status === 200 && data) {
      return data;
    }

    return {};
  };
  const init = async () => {
    setIsLoading(true);
    const [
      apiKeysResponse,
      baseCurrencyResponse,
      subscriptionPlansResponse,
    ] = await Promise.allSettled([
      !apiKeysFetched ? getApiKeys() : Promise.reject('fetched'),
      !baseCurrencyFetched ? getBaseCurrency() : Promise.reject('fetched'),
      getSubscriptionPlans(),
    ]);

    const isApiKeysFulfilled = apiKeysResponse.status === 'fulfilled';
    const apiKeysValue = apiKeysResponse?.value ?? [];
    const baseCurrencyFulfilled = baseCurrencyResponse.status === 'fulfilled';
    const baseCurrencyValue = baseCurrencyResponse?.value ?? initialState.baseCurrency;
    const subscriptionPlansValue = subscriptionPlansResponse?.value?.result ?? [];
    const subscriptionPlansCountValue = subscriptionPlansResponse?.value?.count ?? null;

    ReactDOM.unstable_batchedUpdates(() => {
      if (isApiKeysFulfilled) {
        dispatch(setApiKeys(apiKeysValue));
        dispatch(setHasActiveApiKey(hasActiveApiKey(apiKeysValue)));
        dispatch(setApiKeysFetched(true));
      }
      if (baseCurrencyFulfilled) {
        dispatch(setBaseCurrency(baseCurrencyValue));
        dispatch(setBaseCurrencyFetched(true));
      }
      dispatch(setSubscriptionsPlans(subscriptionPlansValue));
      dispatch(setSubscriptionsPlansCount(subscriptionPlansCountValue));
      dispatch(setSubscriptionsFetched(true));
      setIsLoading(false);
    });
  };

  React.useEffect(() => {
    if (partnerFetched) {
      void init();
    }
  }, [partnerFetched]);

  return {
    isLoading: isLoading || subscriptionPlansFetching,
    updateApiKeys,
    fetchSubscriptionPlans,
    searchText,
    setSearchText,
    page,
    setPage,
  };
};
