import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { nanoid } from 'nanoid';
import CurrenciesTableRowInfoItem from '../currencies-table-row-info-item';

const CurrenciesTableRowInfo = (props) => {
  const {
    className,
    currencies,
  } = props;

  const hasCurrencies = Array.isArray(currencies) && currencies.length > 0;

  return (
    <div className={cn('currencies-table-row-info', className)}>
      <div className="currencies-table-row-info__ths">
        <div className="currencies-table-row-info__th">
          Available for store
        </div>
        <div className="currencies-table-row-info__th">
          Available for exchange
        </div>
        <div className="currencies-table-row-info__th">
          Fiat purchase
        </div>
        <div className="currencies-table-row-info__th">
          Fixed rate
        </div>
      </div>
      {hasCurrencies && currencies.map((item) => (
        <CurrenciesTableRowInfoItem
          key={item?.id || nanoid()}
          href={item?.link}
          isWallet={item?.isWallet}
          isSite={item?.isSite}
          isFixedRateEnabled={item?.isFixedRateEnabled}
        />
      ))}
    </div>
  );
};

CurrenciesTableRowInfo.defaultProps = {
  className: null,
  currencies: null,
};

CurrenciesTableRowInfo.propTypes = {
  className: PropTypes.string,
  currencies: PropTypes.arrayOf(PropTypes.object),
};

export default CurrenciesTableRowInfo;
