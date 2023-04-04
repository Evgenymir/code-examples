import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import LocalizationContext from '../../react-contexts/localization-context';
import BestRatesTableTr from './components/best-rates-table-tr';
import {
  getPairsWithNormalizedData,
  getRandomCurrenciesPairs,
} from './best-rates-table-helpers';
import LoaderIcon from '../icons/loader-icon';

const IS_CLIENT = typeof window === 'object';
const MAX_COUNT_PAIR = 5;

const BestRatesTable = (props) => {
  const {
    className,
    currencies,
  } = props;

  const i18nContext = React.useContext(LocalizationContext);
  const i18n = i18nContext?.MAIN?.SECTIONS_TEXTS?.SECTION_SEVEN ?? {};

  const [isRateShow, setIsRateShow] = React.useState(true);

  const handleTableTrClick = (href) => {
    window.location.href = href;
  };

  const currenciesPair = React.useMemo(() => {
    const hasCurrencies = Array.isArray(currencies) && currencies.length > 0;
    if (!hasCurrencies) {
      return [];
    }
    const randomPairsCount = currencies.length >= MAX_COUNT_PAIR
      ? MAX_COUNT_PAIR
      : Math.floor(currencies.length / 2);
    const randomPairs = getRandomCurrenciesPairs(currencies, randomPairsCount);
    const normalizedPairs = getPairsWithNormalizedData(randomPairs);
    const pairsFiltered = normalizedPairs.filter((item) => Number(item.toAmount));
    const isPairsFilteredEmpty = pairsFiltered.length === 0;
    if (isPairsFilteredEmpty) {
      setIsRateShow(false);
    }
    return isPairsFilteredEmpty ? normalizedPairs : pairsFiltered;
  }, [currencies]);

  return (
    <div className={cn('best-rates-table', className)}>
      {!IS_CLIENT && (
        <div className="best-rates-table__loader">
          <LoaderIcon
            src="/images/loader-gray.gif"
            size={45}
          />
        </div>
      )}
      {IS_CLIENT && (
        <table>
          <thead className="best-rates-table__head">
            <tr>
              <th>{i18n?.TABLE_PAIR_TEXT ?? 'Popular Pair'}</th>
              {isRateShow && (
                <th>{i18n?.TABLE_RATE_TEXT ?? 'Rate'}</th>
              )}
            </tr>
          </thead>
          <tbody className="best-rates-table__body">
            {currenciesPair.map((item) => (
              <BestRatesTableTr
                className={cn([
                  'best-rates-table__tr',
                  !isRateShow && 'best-rates-table__tr_without-border',
                ])}
                key={item.id}
                fromTicker={item.fromTicker}
                fromAmount={item.fromAmount}
                fromImage={item.fromImage}
                toTicker={item.toTicker}
                toAmount={item.toAmount}
                toImage={item.toImage}
                isPercentPlus={item.isPercentPlus}
                isPercentMinus={item.isPercentMinus}
                percent={item.percent}
                href={`${i18nContext.PREFIX}/currencies/${item.fromLink}/${item.toLink}`}
                onClick={handleTableTrClick}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

BestRatesTable.defaultProps = {
  className: null,
  currencies: [],
};

BestRatesTable.propTypes = {
  className: PropTypes.string,
  currencies: PropTypes.arrayOf(PropTypes.object),
};

export default BestRatesTable;
