import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Link from 'next/link';
import CurrencyNetwork from '../currency-network';
import { getNetworkText } from '../../helpers/get-network-text';

const CurrenciesTableCoinRow = (props) => {
  const {
    className,
    href,
    imagePath,
    name,
    currentTicker,
    ticker,
    network,
  } = props;

  const hrefNormalized = href ? `/${href}-wallet` : '/wallets';

  const currencyNetworkLabel = React.useMemo(
    () => getNetworkText(network, ticker),
    [network, ticker],
  );

  return (
    <Link href={hrefNormalized}>
      <a className={cn('currencies-table-coin-row', className)}>
        <div className="currencies-table-coin-row__td">
          <div className="currencies-table-coin-row__image">
            <img
              src={imagePath}
              alt={name}
              width={20}
              height={20}
              decoding="async"
              loading="lazy"
            />
          </div>
          <div className="currencies-table-coin-row__content">
            <div className="currencies-table-coin-row__ticker">
              {currentTicker}
              {currencyNetworkLabel && (
                <CurrencyNetwork
                  className="currencies-table-coin-row__network-mobile"
                  label={currencyNetworkLabel}
                  network={network}
                />
              )}
            </div>
            <div className="currencies-table-coin-row__name">
              {name}
              {currencyNetworkLabel && (
                <CurrencyNetwork
                  className="currencies-table-coin-row__network-desktop"
                  label={currencyNetworkLabel}
                  network={network}
                />
              )}
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
};

CurrenciesTableCoinRow.defaultProps = {
  className: null,
  href: null,
  imagePath: null,
  name: null,
  currentTicker: null,
  ticker: null,
  network: null,
};

CurrenciesTableCoinRow.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string,
  imagePath: PropTypes.string,
  name: PropTypes.string,
  currentTicker: PropTypes.string,
  ticker: PropTypes.string,
  network: PropTypes.string,
};

export default React.memo(CurrenciesTableCoinRow);
