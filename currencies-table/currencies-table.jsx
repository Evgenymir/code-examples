import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import InputSearch from '../input-search';
import SortMenu from '../sort-menu';
import { DEFAULT_PER_PAGE, SORT_MODES } from '../../constants';
import { useOutsideClick } from '../../hooks/use-outside-click';
import { filteredCurrenciesSearch } from '../../utils/filtered-currencies-search';
import LoaderIcon from '../icons/loader-icon';
import CurrencyNotFound from '../currency-not-found';
import NotFoundDarkIcon from '../icons/not-found-dark-icon';
import Pagination from '../pagination';
import { sortByKey } from '../../utils/sort-by-key';
import CurrenciesTableMobile from '../currencies-table-mobile';
import CurrenciesTableDesktop from '../currencies-table-desktop';
import scrollToPosition from '../../helpers/scroll-to-position';
import { useMediaQuery } from '../../hooks/use-media-query';
import setPaginationData from '../pagination/helpers/set-pagination-data';
import { useNowWalletContext, useSelector } from '../../providers/now-wallet-provider';
import useContentCurrenciesList from '../../api/modules/content/use-content-currencies-list';
import {
  currenciesListFetchingSelector,
  currenciesSelector,
} from '../../providers/now-wallet-provider/selectors';
import { setIsCurrenciesListFetched } from '../../providers/now-wallet-provider/actions';
import { runRequestIdleCallbackBatch } from '../../helpers/request-idle-callback-batch';

const NOT_FOUND_TITLE = 'Sorry, no currency was found';
const NOT_FOUND_TEXT = 'Like an asset we don\'t have yet? Reach us at <a href="mailto:support@changenow.io">support@changenow.io</a>';

const CurrenciesTable = (props) => {
  const {
    className,
    initialPage,
    perPage,
    pagination,
    withPaginationHistory,
  } = props;

  const isDesktop = useMediaQuery('(min-width: 992px)');
  const { dispatch } = useNowWalletContext();
  const currencies = useSelector(currenciesSelector());
  const fetching = useSelector(currenciesListFetchingSelector());
  const hasCurrencies = Array.isArray(currencies) && currencies.length > 0;

  const sortMenuRef = React.useRef(null);
  const [isSortMenuOpen, setIsOpenMenuOpen] = React.useState(false);
  const [sortModeType, setSortModeType] = React.useState(SORT_MODES.RANK);
  const [searchText, setSearchText] = React.useState('');
  const [page, setPage] = React.useState(initialPage);

  const handleSortMenuToggle = () => {
    setIsOpenMenuOpen(!isSortMenuOpen);
  };
  const updateSortingMode = (mode) => {
    setSortModeType(mode);
  };
  const handleChangePage = (nextPage) => {
    setPage(nextPage);
    scrollToPosition(document.body, { block: 'start' });
  };

  const currenciesList = React.useMemo(() => {
    const listFiltered = currencies.filter((currency) => !currency.isFiat && currency?.link !== '');
    return sortModeType === 'abc'
      ? listFiltered.sort(sortByKey('ticker'))
      : listFiltered;
  }, [
    currencies,
    sortModeType,
  ]);
  const currenciesFiltered = React.useMemo(() => (
    filteredCurrenciesSearch(currenciesList, searchText)
  ), [currenciesList, searchText]);
  const currenciesFilteredLength = React.useMemo(() => (
    currenciesFiltered?.length || 0
  ), [currenciesFiltered]);
  const currentCurrencies = React.useMemo(() => {
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;
    return currenciesFiltered.slice(startIndex, endIndex);
  }, [
    perPage,
    currenciesFiltered,
    page,
  ]);

  const isShowPagination = currenciesFilteredLength > perPage && pagination;
  const isEmptyCurrenciesWithSearch = Boolean(currenciesFilteredLength === 0 && searchText);

  const handleSearchInputChange = (value) => {
    setSearchText(value);
    setPage(1);
    if (isShowPagination && withPaginationHistory) {
      const totalPagesNumber = Math.ceil(currenciesFilteredLength / perPage);
      setPaginationData(page, 1, totalPagesNumber);
    }
  };

  React.useEffect(() => {
    if (!hasCurrencies) {
      runRequestIdleCallbackBatch([
        () => dispatch(setIsCurrenciesListFetched(false)),
      ]);
    }
  }, [
    dispatch,
    hasCurrencies,
  ]);

  useContentCurrenciesList();

  useOutsideClick(sortMenuRef, () => {
    if (isSortMenuOpen) {
      handleSortMenuToggle();
    }
  });

  return (
    <div className={cn('currencies-table', className)}>
      <div className="currencies-table__box">
        <div className="currencies-table__header">
          <SortMenu
            className="currencies-table__sort-menu"
            title="Sort by"
            onClick={handleSortMenuToggle}
            isOpen={isSortMenuOpen}
            onSortedMode={updateSortingMode}
            sortedMode={sortModeType}
            dropdownRef={sortMenuRef}
          />
          <InputSearch
            className="currencies-table__search"
            onChange={handleSearchInputChange}
            placeholder="Search the coin"
            isDarkTheme
          />
        </div>
        <div className="currencies-table__body">
          {!isDesktop && (
            <CurrenciesTableMobile
              currencies={currentCurrencies}
              fetching={fetching}
              isNotFoundShow={isEmptyCurrenciesWithSearch}
              NotFound={(
                <CurrencyNotFound
                  className="currencies-table__not-found"
                  title={NOT_FOUND_TITLE}
                  text={NOT_FOUND_TEXT}
                  Icon={<NotFoundDarkIcon />}
                  isDarkTheme
                />
              )}
              Loader={(
                <LoaderIcon
                  className="currencies-table__loader"
                  src="/images/loader-black.gif"
                />
              )}
            />
          )}
          {isDesktop && (
            <CurrenciesTableDesktop
              currencies={currentCurrencies}
              fetching={fetching}
              isNotFoundShow={isEmptyCurrenciesWithSearch}
              NotFound={(
                <CurrencyNotFound
                  className="currencies-table__not-found"
                  title={NOT_FOUND_TITLE}
                  text={NOT_FOUND_TEXT}
                  Icon={<NotFoundDarkIcon />}
                  isDarkTheme
                />
              )}
              Loader={(
                <LoaderIcon
                  className="currencies-table__loader"
                  src="/images/loader-black.gif"
                />
              )}
            />
          )}
        </div>
      </div>
      {isShowPagination && (
        <Pagination
          className="currencies-table__pagination"
          currentPage={page}
          countItems={currenciesFilteredLength}
          itemsPerPage={perPage}
          onChangePage={handleChangePage}
          withHistory={withPaginationHistory}
        />
      )}
    </div>
  );
};

CurrenciesTable.defaultProps = {
  className: null,
  initialPage: 1,
  pagination: false,
  withPaginationHistory: false,
  perPage: DEFAULT_PER_PAGE,
};

CurrenciesTable.propTypes = {
  className: PropTypes.string,
  initialPage: PropTypes.number,
  pagination: PropTypes.bool,
  withPaginationHistory: PropTypes.bool,
  perPage: PropTypes.number,
};

export default CurrenciesTable;
