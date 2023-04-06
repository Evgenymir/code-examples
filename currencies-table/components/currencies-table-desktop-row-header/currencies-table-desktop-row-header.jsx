import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const CurrenciesTableDesktopHeader = (props) => {
  const { className } = props;

  return (
    <div className={cn('currencies-table-desktop-header', className)}>
      <div className="currencies-table-desktop-header__th">
        Coin
      </div>
      <div className="currencies-table-desktop-header__th">
        Available for store
      </div>
      <div className="currencies-table-desktop-header__th">
        Available for exchange
      </div>
      <div className="currencies-table-desktop-header__th">
        Fiat purchase
      </div>
      <div className="currencies-table-desktop-header__th">
        Fixed rate
      </div>
    </div>
  );
};

CurrenciesTableDesktopHeader.defaultProps = {
  className: null,
};

CurrenciesTableDesktopHeader.propTypes = {
  className: PropTypes.string,
};

export default CurrenciesTableDesktopHeader;
