import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import isFunction from 'lodash/isFunction';

const BestRatesTableTr = (props) => {
  const {
    className,
    fromTicker,
    fromAmount,
    fromImage,
    toTicker,
    toAmount,
    toImage,
    isPercentPlus,
    isPercentMinus,
    percent,
    href,
    onClick,
  } = props;

  const toAmountNumber = Number(toAmount);
  const isToAmount = Boolean(toAmountNumber);

  const handleClick = () => {
    if (isFunction(onClick)) {
      onClick(href);
    }
  };
  const handleKeyPress = () => {
    if (isFunction(onClick)) {
      onClick(href);
    }
  };

  return (
    <tr
      className={cn('best-rates-table-tr', className)}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      tabIndex={0}
      role="button"
    >
      <td className="best-rates-table-tr__td">
        <div className="best-rates-table-tr__td-left-box">
          <div className="best-rates-table-tr__images">
            {fromImage && (
              <img
                src={fromImage}
                alt={fromTicker}
                decoding="async"
                loading="lazy"
                width={20}
                height={20}
              />
            )}
            {toImage && (
              <span className="best-rates-table-tr__image-last">
                <img
                  src={toImage}
                  alt={toTicker}
                  decoding="async"
                  loading="lazy"
                  width={20}
                  height={20}
                />
              </span>
            )}
          </div>
          <div className="best-rates-table-tr__tickers">
            {fromTicker}
            <img
              src="/images/index-images/arrow-white-small.svg"
              alt="Icon"
              decoding="async"
              loading="lazy"
              width={12}
              height={12}
              className="best-rates-table-tr__tickers-arrow"
            />
            {toTicker}
          </div>
        </div>
      </td>
      {isToAmount && (
        <td className="best-rates-table-tr__td">
          <div className="best-rates-table-tr__td-right-box">
            <div className="best-rates-table-tr__price">
              {fromAmount}
              {' '}
              {fromTicker}
              {' '}
              ~
              {' '}
              {toAmount}
              &nbsp;
              {toTicker}
            </div>
            <div className={cn([
              'best-rates-table-tr__percent',
              isPercentPlus && 'best-rates-table-tr__percent_plus',
              isPercentMinus && 'best-rates-table-tr__percent_minus',
            ])}
            >
              {percent}
              %
              {' '}
              /
              {' '}
              24h
            </div>
          </div>
        </td>
      )}
    </tr>
  );
};

BestRatesTableTr.defaultProps = {
  className: null,
  fromTicker: null,
  fromAmount: null,
  fromImage: null,
  toTicker: null,
  toAmount: null,
  toImage: null,
  isPercentPlus: false,
  isPercentMinus: false,
  percent: null,
  href: null,
  onClick: null,
};

BestRatesTableTr.propTypes = {
  className: PropTypes.string,
  fromTicker: PropTypes.string,
  fromAmount: PropTypes.string,
  fromImage: PropTypes.string,
  toTicker: PropTypes.string,
  toAmount: PropTypes.string,
  toImage: PropTypes.string,
  isPercentPlus: PropTypes.bool,
  isPercentMinus: PropTypes.bool,
  percent: PropTypes.string,
  href: PropTypes.string,
  onClick: PropTypes.func,
};

export default React.memo(BestRatesTableTr);
