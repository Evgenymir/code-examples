import * as React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { LoaderIcon } from '../icons/loader-icon';
import { useMediaQuery } from '../../hooks/use-media-query';
import { debounce } from '../../helpers/utils';
import { ROUTES } from '../../constants/routes';
import { ButtonBack } from '../shared/button-back';
import { hasElementsInArray } from '../../helpers/has-elements-in-array';
import { SubscriptionPlanInfo } from './components/subscription-plan-info';
import { SubscriptionPlanFilter } from './components/subscription-plan-filter';
import { SubscriptionPlanTable } from './components/subscription-plan-table';
import { PopupCreateUsers } from './components/popup-create-users';
import {
  useCreateUsersToSubscribe,
  useSubscriptionPlanPageInitState,
} from './hooks';
import classes from './subscription-plan-styles.module.scss';

export const SubscriptionPlanPage = () => {
  const isDesktop = useMediaQuery('(min-width: 1200px)');
  const history = useHistory();
  const params = useParams();
  const planId = params?.planId ?? null;

  const {
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
  } = useSubscriptionPlanPageInitState(planId);

  const {
    isPopupCreateUsersShown,
    setIsPopupCreateUsersShown,
    createUsersPending,
    createUsersError,
    createUsersApiError,
    createUsersSuccess,
    handleCreateUsersSubmit,
  } = useCreateUsersToSubscribe(planId);

  const handleBackClick = () => {
    history.push(ROUTES.SUBSCRIPTIONS);
  };
  const handlePopupCreateUsersOpen = () => {
    setIsPopupCreateUsersShown(true);
  };
  const handlePopupCreateUsersClose = () => {
    setIsPopupCreateUsersShown(false);
  };
  const handleSearchChange = React.useCallback(debounce(async (value) => {
    await reFetchUsers(1, value);
    setSearchText(value);
    setPage(1);
  }, 300), [setSearchText, setPage]);
  const handleSubscriptionPlanRowClick = React.useCallback((id) => {
    history.push(`${ROUTES.SUBSCRIPTIONS}/${planId}/${id}`);
  }, []);
  const handlePaginatorClick = React.useCallback(async (nextPage) => {
    await reFetchUsers(nextPage, searchText);
    setPage(nextPage);
  }, [searchText]);

  React.useEffect(() => {
    if (createUsersSuccess) {
      void reFetchUsers();
    }
  }, [createUsersSuccess]);

  React.useEffect(() => {
    if (isSubscriptionNotFound) {
      history.push(ROUTES.SUBSCRIPTIONS);
    }
  }, [isSubscriptionNotFound]);

  if (isLoading || !isLoaded) {
    return (
      <div className={classes.subscriptionPlanLoader}>
        <LoaderIcon size={40} />
      </div>
    );
  }

  return (
    <div className={classes.subscriptionPlan}>
      <div className={classes.subscriptionPlanTitle}>
        <ButtonBack
          className={classes.subscriptionPlanBack}
          onClick={handleBackClick}
        />
        {planData?.title}
      </div>
      <SubscriptionPlanInfo
        className={classes.subscriptionPlanInfo}
        data={planData}
        desktop={isDesktop}
      />
      <SubscriptionPlanFilter
        className={classes.subscriptionPlanFilter}
        onClick={handlePopupCreateUsersOpen}
        onChangeSearch={handleSearchChange}
        disabled={isLoading}
      />
      <SubscriptionPlanTable
        items={users}
        hasItems={hasElementsInArray(users)}
        hasSearchData={Boolean(searchText)}
        onClick={handleSubscriptionPlanRowClick}
        onButtonClick={handlePopupCreateUsersOpen}
        count={usersCount}
        onPaginatorClick={handlePaginatorClick}
        page={page}
        reFetching={reFetching}
        apiError={usersApiError}
      />
      <PopupCreateUsers
        open={isPopupCreateUsersShown}
        onClose={handlePopupCreateUsersClose}
        onSubmit={handleCreateUsersSubmit}
        errorMessage={createUsersError}
        errorApiMessage={createUsersApiError}
        fetching={createUsersPending}
        sent={createUsersSuccess}
      />
    </div>
  );
};
