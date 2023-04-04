import { nanoid } from 'nanoid';
import { formatToFixed } from '../../../server/utils/formatToFixed';
import { safeToUpperCase } from '../../helpers/safe-to-upper-case';

const MAX_RECURSION_COUNT = 100;

/**
 * @param currencies {array}
 * @param count {number}
 * @returns {[]}
 */
export const getRandomCurrenciesPairs = (currencies, count = 1) => {
  const hasCurrencies = Array.isArray(currencies) && currencies.length > 0;
  const randomPairs = [];

  if (!hasCurrencies) {
    return randomPairs;
  }

  const currenciesLength = currencies.length;
  const makePair = (pairs, recursionCount) => {
    if (pairs.length >= count || recursionCount >= MAX_RECURSION_COUNT) {
      return false;
    }
    const randomNumberFrom = Math.floor(Math.random() * currenciesLength);
    const randomNumberTo = Math.floor(Math.random() * currenciesLength);
    const currencyFrom = currencies[randomNumberFrom];
    const currencyTo = currencies[randomNumberTo];
    const isDuplicateCoins = currencyFrom?.id === currencyTo?.id;
    const hasPair = pairs.some((element) => (
      element?.from?.id === currencyFrom?.id && element?.to?.id === currencyTo?.id
    ));
    if (isDuplicateCoins || hasPair) {
      return makePair(pairs, recursionCount + 1);
    }
    pairs.push({
      from: currencyFrom,
      to: currencyTo,
    });
    return makePair(pairs, recursionCount + 1);
  };
  makePair(randomPairs, 0);
  return randomPairs;
};

/**
 * @param pairs {array}
 * @returns {[]}
 */
export const getPairsWithNormalizedData = (pairs) => {
  const hasPairs = Array.isArray(pairs) && pairs.length > 0;
  if (!hasPairs) {
    return [];
  }

  const pairsNormalized = pairs.map((pair) => {
    const from = pair?.from ?? {};
    const to = pair?.to ?? {};
    const fromLink = from?.link ?? '';
    const fromCurrentTicker = safeToUpperCase(from?.currentTicker ?? '');
    const fromImage = from?.icon?.url ?? '/images/default-coin.svg';
    const fromPrice = Number(from?.price);
    const fromPriceNormalized = Number.isNaN(fromPrice) ? 0 : fromPrice;
    const fromPercent = Number(from?.percentChange24h);
    const fromPercentNormalized = Number.isNaN(fromPercent) ? 0 : fromPercent;
    const fromPriceWithPercent = (fromPriceNormalized * fromPercentNormalized) / 100;
    const currentFromPrice = fromPriceNormalized + fromPriceWithPercent;
    const toLink = to?.link ?? '';
    const toCurrentTicker = safeToUpperCase(to?.currentTicker ?? '');
    const toImage = to?.icon?.url ?? '/images/default-coin.svg';
    const toPrice = Number(to?.price);
    const toPriceNormalized = Number.isNaN(toPrice) ? 0 : toPrice;
    const toPercent = Number(to?.percentChange24h);
    const toPercentNormalized = Number.isNaN(toPercent) ? 0 : toPercent;
    const toPriceWithPercent = (toPriceNormalized * toPercentNormalized) / 100;
    const currentToPrice = toPriceNormalized + toPriceWithPercent;
    const currentAmount = currentFromPrice && currentToPrice
      ? currentFromPrice / currentToPrice
      : 0;
    const currentAmountToFixed = formatToFixed(currentAmount, 5);
    const currentPercent = fromPercentNormalized - toPercentNormalized;
    const currentPercentToFixed = formatToFixed(currentPercent, 2);
    const currentPercentNormalized = currentPercent > 0
      ? `+${currentPercentToFixed}`
      : currentPercentToFixed;

    return {
      id: nanoid(),
      fromLink,
      fromTicker: fromCurrentTicker,
      fromAmount: '1',
      fromImage,
      toLink,
      toTicker: toCurrentTicker,
      toAmount: currentAmountToFixed,
      toImage,
      percent: currentPercentNormalized,
      isPercentPlus: currentPercent > 0,
      isPercentMinus: currentPercent < 0,
    };
  });

  return pairsNormalized;
};
