import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Link from 'next/link';
import { getNetworkText } from '../../helpers/get-network-text';
import CurrencyNetwork from '../currency-network';

const CurrenciesTableDesktopRow = (props) => {
  const {
    className,
    href,
    imagePath,
    name,
    ticker,
    network,
    isWallet,
    isSite,
    isFixedRateEnabled,
  } = props;

  const hrefNormalized = href ? `/${href}-wallet` : '/wallets';
  const currentStorePathIcon = isWallet
    ? '/images/icons/store-active.svg'
    : '/images/icons/store.svg';
  const currentExchangeIconPath = isSite
    ? '/images/icons/exchange-active.svg'
    : '/images/icons/exchange.svg';
  const currentBuyIconPath = isSite
    ? '/images/icons/buy-active.svg'
    : '/images/icons/buy.svg';
  const currentFixedRateIconPath = isFixedRateEnabled
    ? '/images/icons/fixed-rate-active.svg'
    : '/images/icons/fixed-rate.svg';

  const currencyNetworkLabel = React.useMemo(
    () => getNetworkText(network, ticker),
    [network, ticker],
  );

  return (
    <Link href={hrefNormalized}>
      <a className={cn('currencies-table-desktop-row', className)}>
        <div className="currencies-table-desktop-row__td">
          <div className="currencies-table-desktop-row__image">
            <img
              src={imagePath}
              alt={name}
              width={22}
              height={24}
              decoding="async"
              loading="lazy"
            />
          </div>
          <div className="currencies-table-desktop-row__content">
            <div className="currencies-table-desktop-row__ticker">
              {ticker}
            </div>
            <div className="currencies-table-desktop-row__name">
              {name}
            </div>
            {currencyNetworkLabel && (
              <CurrencyNetwork
                className="currencies-table-desktop-row__network"
                label={currencyNetworkLabel}
                network={network}
              />
            )}
          </div>
        </div>
        <div className="currencies-table-desktop-row__td">
          <img
            src={currentStorePathIcon}
            alt="Icon"
            width={24}
            height={24}
            decoding="async"
            loading="lazy"
          />
        </div>
        <div className="currencies-table-desktop-row__td">
          <img
            src={currentExchangeIconPath}
            alt="Icon"
            width={24}
            height={24}
            decoding="async"
            loading="lazy"
          />
        </div>
        <div className="currencies-table-desktop-row__td">
          <img
            src={currentBuyIconPath}
            alt="Icon"
            width={24}
            height={24}
            decoding="async"
            loading="lazy"
          />
        </div>
        <div className="currencies-table-desktop-row__td">
          <img
            src={currentFixedRateIconPath}
            alt="Icon"
            width={24}
            height={24}
            decoding="async"
            loading="lazy"
          />
        </div>
      </a>
    </Link>
  );
};

CurrenciesTableDesktopRow.defaultProps = {
  className: null,
  href: null,
  imagePath: null,
  name: null,
  ticker: null,
  network: null,
  isWallet: false,
  isSite: false,
  isFixedRateEnabled: false,
};

CurrenciesTableDesktopRow.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string,
  imagePath: PropTypes.string,
  name: PropTypes.string,
  ticker: PropTypes.string,
  network: PropTypes.string,
  isWallet: PropTypes.bool,
  isSite: PropTypes.bool,
  isFixedRateEnabled: PropTypes.bool,
};

export default React.memo(CurrenciesTableDesktopRow);
