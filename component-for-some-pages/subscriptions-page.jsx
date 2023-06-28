import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFetchPartnerProfile } from '../../api/modules/account/use-fetch-partner-profile';
import { useAllCurrencies } from '../../hooks/use-all-currencies';
import { partnerFetchingSelector } from '../../store/partner/selectors';
import { currenciesFetchingSelector, currencyListSelector } from '../../store/currencies/selectors';
import {
  apiKeysHasActiveKeySelector,
  baseCurrencySelector,
  paymentSettingsFetchingSelector,
} from '../../store/payment-settings/selectors';
import { AddWalletCurrenciesPopup } from '../add-wallet-currencies-popup';
import { debounce } from '../../helpers/utils';
import { useFullBaseCurrency } from '../../hooks/use-full-base-currency';
import { ROUTES } from '../../constants/routes';
import {
  subscriptionPlansErrorSelector,
  subscriptionPlansFetchedSelector,
  subscriptionsPlansCountSelector,
  subscriptionsPlansSelector,
} from '../../store/subscriptions/selectors';
import { hasElementsInArray } from '../../helpers/has-elements-in-array';
import { usePageNamesToDisplayInfo } from '../../hooks/use-page-names-to-display-info';
import { PAGE_NAMES_TO_DISPLAY_INFO } from '../../constants/app-constants';
import { PageHeader } from '../ui/page-header';
import {
  useSubscriptionsPageInitState,
  useSubscriptionsPagePopups,
  useCreateSubscriptionPlan,
} from './hooks';
import { CreateSubscriptionPlanPopup } from './components/create-subscription-plan-popup';
import { SubscriptionsTableMemo } from './components/subscriptions-table';
import { SubscriptionsFilter } from './components/subscriptions-filter';
import { SubscriptionsInfoAboutUse } from './components/subscriptions-info-about-use';
import classes from './subscriptions-page-styles.module.scss';

export const SubscriptionsPage = () => {
  const history = useHistory();
  const partnerFetching = useSelector(partnerFetchingSelector());
  const currencyList = useSelector(currencyListSelector());
  const currenciesFetching = useSelector(currenciesFetchingSelector());
  const paymentSettingsFetching = useSelector(paymentSettingsFetchingSelector());
  const apiKeysHasActiveKey = useSelector(apiKeysHasActiveKeySelector());
  const baseCurrency = useSelector(baseCurrencySelector());
  const { fullBaseCurrency } = useFullBaseCurrency(baseCurrency, currencyList);
  const subscriptionsPlans = useSelector(subscriptionsPlansSelector());
  const subscriptionsPlansCount = useSelector(subscriptionsPlansCountSelector());
  const subscriptionPlansFetched = useSelector(subscriptionPlansFetchedSelector());
  const subscriptionPlansError = useSelector(subscriptionPlansErrorSelector());

  const {
    isLoading,
    updateApiKeys,
    fetchSubscriptionPlans,
    searchText,
    setSearchText,
    page,
    setPage,
  } = useSubscriptionsPageInitState();

  const {
    isAddWalletPopupShown,
    setIsAddWalletPopupShown,
    isCreatePlanPopupShown,
    setIsCreatePlanPopupShown,
    handleAddWalletPopupOpen,
    handleAddWalletPopupClose,
    handleCreatePlanPopupOpen,
    handleCreatePlanPopupClose,
  } = useSubscriptionsPagePopups();

  const {
    createPlanFetching,
    createPlanError,
    handleCreateSubscriptionPlanSubmit,
  } = useCreateSubscriptionPlan(fetchSubscriptionPlans, setPage, setIsCreatePlanPopupShown);

  const {
    infoBoxShow,
    addPageNameToDisplayInfo,
    removePageNameToDisplayInfo,
  } = usePageNamesToDisplayInfo(PAGE_NAMES_TO_DISPLAY_INFO.SUBSCRIPTIONS);

  const handleUpdateApiKeys = async () => {
    await updateApiKeys();
    setIsAddWalletPopupShown(false);
    setIsCreatePlanPopupShown(true);
  };
  const handleSearchChange = debounce(async (value) => {
    await fetchSubscriptionPlans(1, value);
    setSearchText(value);
    setPage(1);
  }, 300);
  const handleTablePlanClick = React.useCallback((planId) => {
    history.push(`${ROUTES.SUBSCRIPTIONS}/${planId}`);
  }, [history]);
  const handlePaginatorClick = React.useCallback(async (nextPage) => {
    await fetchSubscriptionPlans(nextPage, searchText);
    setPage(nextPage);
  }, [searchText]);

  useFetchPartnerProfile();
  useAllCurrencies();

  const dataLoading = partnerFetching || currenciesFetching || isLoading || !subscriptionPlansFetched;
  const handleCreateSubscriptionButtonClick = apiKeysHasActiveKey
    ? handleCreatePlanPopupOpen
    : handleAddWalletPopupOpen;

  return (
    <div>
      <PageHeader
        title="Subscriptions"
        showTooltipFirstText={!infoBoxShow}
        onClick={infoBoxShow ? removePageNameToDisplayInfo : addPageNameToDisplayInfo}
      />
      {infoBoxShow && (
        <SubscriptionsInfoAboutUse
          className={classes.infoBlock}
          name={PAGE_NAMES_TO_DISPLAY_INFO.SUBSCRIPTIONS}
          onClose={removePageNameToDisplayInfo}
        />
      )}
      <SubscriptionsFilter
        disabled={dataLoading}
        onClick={handleCreateSubscriptionButtonClick}
        onChangeSearch={handleSearchChange}
      />
      <SubscriptionsTableMemo
        items={subscriptionsPlans}
        hasItems={hasElementsInArray(subscriptionsPlans)}
        hasSearchData={Boolean(searchText)}
        loading={dataLoading}
        onClick={handleTablePlanClick}
        count={subscriptionsPlansCount}
        onPaginatorClick={handlePaginatorClick}
        page={page}
        apiError={subscriptionPlansError}
      />
      <CreateSubscriptionPlanPopup
        open={isCreatePlanPopupShown}
        onClose={handleCreatePlanPopupClose}
        fullBaseCurrency={fullBaseCurrency}
        onSubmit={handleCreateSubscriptionPlanSubmit}
        errorApiMessage={createPlanError}
        pending={createPlanFetching}
      />
      <AddWalletCurrenciesPopup
        open={isAddWalletPopupShown}
        onClose={handleAddWalletPopupClose}
        currencies={currencyList}
        onCallback={handleUpdateApiKeys}
        updateFetching={paymentSettingsFetching}
      />
    </div>
  );
};
