import * as React from 'react';

export const useSubscriptionsPagePopups = () => {
  const [isAddWalletPopupShown, setIsAddWalletPopupShown] = React.useState(false);
  const [isCreatePlanPopupShown, setIsCreatePlanPopupShown] = React.useState(false);

  const handleAddWalletPopupOpen = () => {
    setIsAddWalletPopupShown(true);
  };
  const handleAddWalletPopupClose = () => {
    setIsAddWalletPopupShown(false);
  };
  const handleCreatePlanPopupOpen = () => {
    setIsCreatePlanPopupShown(true);
  };
  const handleCreatePlanPopupClose = () => {
    setIsCreatePlanPopupShown(false);
  };

  return {
    isAddWalletPopupShown,
    setIsAddWalletPopupShown,
    isCreatePlanPopupShown,
    setIsCreatePlanPopupShown,
    handleAddWalletPopupOpen,
    handleAddWalletPopupClose,
    handleCreatePlanPopupOpen,
    handleCreatePlanPopupClose,
  };
};
