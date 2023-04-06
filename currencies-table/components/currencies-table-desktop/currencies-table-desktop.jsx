import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { nanoid } from 'nanoid';
import CurrenciesTableDesktopHeader from '../currencies-table-desktop-row-header';
import CurrenciesTableDesktopRow from '../currencies-table-desktop-row';

const CurrenciesTableDesktop = (props) => {
  const {
    className,
    currencies,
    fetching,
    isNotFoundShow,
    NotFound,
    Loader,
  } = props;

  const hasCurrencies = Array.isArray(currencies) && currencies.length > 0;

  return (
    <div className={cn('currencies-table-desktop', className)}>
      <CurrenciesTableDesktopHeader />
      {hasCurrencies && currencies.map((item) => (
        <CurrenciesTableDesktopRow
          key={item?.id || nanoid()}
          href={item?.link}
          imagePath={item?.icon?.url}
          name={item?.name}
          ticker={item?.currentTicker}
          network={item?.network}
          isWallet={item?.isWallet}
          isSite={item?.isSite}
          isFixedRateEnabled={item?.isFixedRateEnabled}
        />
      ))}
      {fetching && (
        <div className="currencies-table-desktop__loader">
          {Loader}
        </div>
      )}
      {isNotFoundShow && (
        <div className="currencies-table-desktop__not-found">
          {NotFound}
        </div>
      )}
    </div>
  );
};

CurrenciesTableDesktop.defaultProps = {
  className: null,
  currencies: null,
  fetching: false,
  isNotFoundShow: false,
  NotFound: null,
  Loader: null,
};

CurrenciesTableDesktop.propTypes = {
  className: PropTypes.string,
  currencies: PropTypes.arrayOf(PropTypes.object),
  fetching: PropTypes.bool,
  isNotFoundShow: PropTypes.bool,
  NotFound: PropTypes.element,
  Loader: PropTypes.element,
};

export default CurrenciesTableDesktop;
