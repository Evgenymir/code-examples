import * as React from 'react';
import { hasElementsInArray } from '../../../helpers/has-elements-in-array';
import { useMediaQuery } from '../../../hooks/use-media-query';

export const useSubscriptionUserPageFilter = (fetchUserPayments) => {
  const isDesktop = useMediaQuery('(min-width: 992px)');

  const [searchText, setSearchText] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [activeFilterItemsNumber, setActiveFilterItemsNumber] = React.useState(null);
  const [filterData, setFilterData] = React.useState(null);
  const [createdFrom, setCreatedFrom] = React.useState(null);
  const [createdTo, setCreatedTo] = React.useState(null);

  const handleDateChange = React.useCallback(({ from, to }) => {
    setCreatedFrom(from);
    setCreatedTo(to);
  }, []);
  const handleFilterReset = React.useCallback(async () => {
    if (!filterData && !createdFrom && !createdTo) {
      return;
    }

    setFilterData(null);
    setCreatedFrom(null);
    setCreatedTo(null);

    await fetchUserPayments(1, searchText, null);
    setPage(1);
  }, [filterData, createdFrom, createdTo, searchText]);
  const handleFilterSubmit = React.useCallback(async (data, setIsFilterActive) => {
    const hasData = Object.values(data).find((item) => item);
    if (!hasData && !createdFrom && !createdTo) {
      return;
    }

    const date = createdFrom ? { from: createdFrom, to: createdTo } : null;
    const nextData = { ...data, date };

    setFilterData((prevState) => ({
      ...prevState,
      ...nextData,
    }));
    if (!isDesktop) {
      setIsFilterActive(false);
    }
    await fetchUserPayments(1, searchText, nextData);
    setPage(1);
  }, [createdFrom, createdTo, isDesktop, searchText]);

  React.useEffect(() => {
    if (filterData) {
      const dataNormalized = Object.values(filterData);
      const dataFiltered = dataNormalized.filter((item) => item);
      const hasDataFiltered = hasElementsInArray(dataFiltered);
      const activeNumbers = hasDataFiltered ? dataFiltered?.length : null;
      setActiveFilterItemsNumber(activeNumbers);
    } else {
      setActiveFilterItemsNumber(null);
    }
  }, [filterData, createdFrom, createdTo]);

  return {
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
  };
};
