import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Link from 'next/link';

const CurrenciesTableRowInfoItem = (props) => {
  const {
    className,
    href,
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

  return (
    <Link href={hrefNormalized}>
      <a className={cn('currencies-table-row-info-item', className)}>
        <div className="currencies-table-row-info-item__td">
          <img
            src={currentStorePathIcon}
            alt="Icon"
            width={24}
            height={24}
            decoding="async"
            loading="lazy"
          />
        </div>
        <div className="currencies-table-row-info-item__td">
          <img
            src={currentExchangeIconPath}
            width={24}
            height={24}
            alt="Icon"
            decoding="async"
            loading="lazy"
          />
        </div>
        <div className="currencies-table-row-info-item__td">
          <img
            src={currentBuyIconPath}
            alt="Icon"
            width={24}
            height={24}
            decoding="async"
            loading="lazy"
          />
        </div>
        <div className="currencies-table-row-info-item__td">
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

CurrenciesTableRowInfoItem.defaultProps = {
  className: null,
  href: null,
  isWallet: false,
  isSite: false,
  isFixedRateEnabled: false,
};

CurrenciesTableRowInfoItem.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string,
  isWallet: PropTypes.bool,
  isSite: PropTypes.bool,
  isFixedRateEnabled: PropTypes.bool,
};

export default React.memo(CurrenciesTableRowInfoItem);
