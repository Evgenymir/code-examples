import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import CurrenciesTableCoin from '../currencies-table-coin';
import CurrenciesTableRowInfo from '../currencies-table-row-info';

const CurrenciesTableMobile = (props) => {
  const {
    className,
    currencies,
    fetching,
    isNotFoundShow,
    NotFound,
    Loader,
  } = props;

  return (
    <div className={cn('currencies-table-mobile', className)}>
      <div className="currencies-table-mobile__column-left">
        <CurrenciesTableCoin
          currencies={currencies}
        />
      </div>
      <div className="currencies-table-mobile__column-right">
        <CurrenciesTableRowInfo
          currencies={currencies}
        />
      </div>
      {fetching && (
        <div className="currencies-table-mobile__loader">
          {Loader}
        </div>
      )}
      {isNotFoundShow && (
        <div className="currencies-table-mobile__not-found">
          {NotFound}
        </div>
      )}
    </div>
  );
};

CurrenciesTableMobile.defaultProps = {
  className: null,
  currencies: null,
  fetching: false,
  isNotFoundShow: false,
  NotFound: null,
  Loader: null,
};

CurrenciesTableMobile.propTypes = {
  className: PropTypes.string,
  currencies: PropTypes.arrayOf(PropTypes.object),
  fetching: PropTypes.bool,
  isNotFoundShow: PropTypes.bool,
  NotFound: PropTypes.element,
  Loader: PropTypes.element,
};

export default CurrenciesTableMobile;
