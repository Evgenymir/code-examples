import * as React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { LoaderIcon } from '../icons/loader-icon';
import { useMediaQuery } from '../../hooks/use-media-query';
import { ROUTES } from '../../constants/routes';
import { useFetchPartnerProfile } from '../../api/modules/account/use-fetch-partner-profile';
import { useAllCurrencies } from '../../hooks/use-all-currencies';
import { debounce } from '../../helpers/utils';
import { ButtonBack } from '../shared/button-back';
import { hasElementsInArray } from '../../helpers/has-elements-in-array';
import {
  useSubscriptionUserPageInitState,
  useDeleteUser,
  useSubscriptionUserPagePopups,
  useSubscriptionUserPageFilter,
} from './hooks';
import { SubscriptionUserInfo } from './components/subscription-user-info';
import { SubscriptionUserFullFilter } from './components/subscription-user-full-filter';
import { SubscriptionUserTable } from './components/subscription-user-table';
import { PopupDeactivateUser } from './components/popup-deactivate-user';
import { PopupPaymentInfo } from './components/popup-payment-info';
import classes from './subscriprion-user-styles.module.scss';

export const SubscriptionUserPage = () => {
  const isTablet = useMediaQuery('(min-width: 768px)');
  const history = useHistory();
  const params = useParams();
  const { planId, userId } = params;

  const {
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
  } = useSubscriptionUserPageInitState(userId, planId);

  const {
    searchText,
    setSearchText,
    page,
    setPage,
    filterData,
    activeFilterItemsNumber,
    createdFrom,
    createdTo,
    handleDateChange,
    handleFilterReset,
    handleFilterSubmit,
  } = useSubscriptionUserPageFilter(fetchUserPayments);

  const {
    deleteUserPending,
    deleteUserError,
    handleDeleteUser,
  } = useDeleteUser(userData?.id, planId);

  const {
    isPopupDeactivateUserShown,
    isPopupPaymentInfoShown,
    setIsPopupPaymentInfoShown,
    handleDeactivatePopupToggle,
    handlePaymentInfoPopupClose,
  } = useSubscriptionUserPagePopups(setUserPayment);

  const handleBackClick = () => {
    history.push(`${ROUTES.SUBSCRIPTIONS}/${planId}`);
  };
  const handleSearchChange = React.useCallback(debounce(async (value) => {
    await fetchUserPayments(1, value, filterData);
    setSearchText(value);
    setPage(1);
  }, 300), [setSearchText, setPage, filterData]);
  const handleTransactionRowClick = React.useCallback((data) => {
    setUserPayment(data || null);
    setIsPopupPaymentInfoShown(true);
  }, []);
  const handlePaginatorClick = React.useCallback(async (nextPage) => {
    await fetchUserPayments(nextPage, searchText, filterData);
    setPage(nextPage);
  }, [searchText, filterData]);

  useFetchPartnerProfile();
  useAllCurrencies();

  React.useEffect(() => {
    if (isUserNotFound) {
      history.replace(`${ROUTES.SUBSCRIPTIONS}/${planId}`);
    }
  }, [isUserNotFound]);

  const hasSearchData = Boolean(searchText) || Boolean(filterData);

  if (isLoading || !isLoaded) {
    return (
      <div className={classes.loader}>
        <LoaderIcon size={40} />
      </div>
    );
  }

  return (
    <div className={classes.subscriptionUser}>
      <div className={classes.subscriptionUserTitle}>
        <ButtonBack
          className={classes.subscriptionUserBack}
          onClick={handleBackClick}
        />
        User transactions
      </div>
      <SubscriptionUserInfo
        className={classes.subscriptionUserInfo}
        data={userData}
        desktop={isTablet}
        thText="Actions"
        tdElement={userData?.id && (
          <div
            onClick={handleDeactivatePopupToggle}
            className={classes.subscriptionUserInfoDeactivate}
          >
            Deactivate
          </div>
        )}
      />
      <SubscriptionUserFullFilter
        className={classes.subscriptionUserFullFilter}
        onSearchChange={handleSearchChange}
        activeFilterItemsNumber={activeFilterItemsNumber}
        createdFrom={createdFrom}
        createdTo={createdTo}
        onDateRangeChange={handleDateChange}
        onSubmit={handleFilterSubmit}
        onFilterReset={handleFilterReset}
        filterFormData={filterData}
      />
      <SubscriptionUserTable
        items={userPayments}
        hasItems={hasElementsInArray(userPayments)}
        hasSearchData={hasSearchData}
        onClick={handleTransactionRowClick}
        count={userPaymentsCount}
        onPaginatorClick={handlePaginatorClick}
        page={page}
        apiError={userPaymentsApiError}
        loading={isFetching}
      />
      <PopupDeactivateUser
        open={isPopupDeactivateUserShown}
        onClose={handleDeactivatePopupToggle}
        onClick={handleDeleteUser}
        error={deleteUserError}
        fetching={deleteUserPending}
        email={userData?.subscriber?.email}
        id={userData?.id}
      />
      <PopupPaymentInfo
        open={isPopupPaymentInfoShown}
        onClose={handlePaymentInfoPopupClose}
        subscriptionName={subscriptionPlanData?.title}
        items={userPaymentInfoItems}
      />
    </div>
  );
};
