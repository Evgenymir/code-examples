import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { nanoid } from 'nanoid';
import CurrenciesTableCoinRow from '../currencies-table-coin-row';

const CurrenciesTableCoin = (props) => {
  const {
    className,
    currencies,
  } = props;

  const hasCurrencies = Array.isArray(currencies) && currencies.length > 0;

  return (
    <div className={cn('currencies-table-coin', className)}>
      <div className="currencies-table-coin__th">
        Coin
      </div>
      {hasCurrencies && currencies.map((item) => (
        <CurrenciesTableCoinRow
          key={item?.id || nanoid()}
          className="currencies-table-coin__row"
          href={item?.link}
          imagePath={item?.icon?.url}
          name={item?.name}
          currentTicker={item?.currentTicker}
          ticker={item?.ticker}
          network={item?.network}
        />
      ))}
    </div>
  );
};

CurrenciesTableCoin.defaultProps = {
  className: null,
  currencies: null,
};

CurrenciesTableCoin.propTypes = {
  className: PropTypes.string,
  currencies: PropTypes.arrayOf(PropTypes.object),
};

export default CurrenciesTableCoin;
