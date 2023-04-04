import { MONTHS_IN_YEAR } from '../../../../constants/datetime-constants';
import toFixed from '../../../../helpers/to-fixed';
import formatDate from '../../../../helpers/format-date';

/**
 * @param graphWidth {number}
 * @param months {number}
 * @param maxMonths {number}
 * @param lineWidth {number}
 * @returns {number}
 */
export const getStakingGraphOffsetX = (
  graphWidth,
  months = 0,
  maxMonths = 36,
  lineWidth = 3,
) => {
  const isNumber = typeof graphWidth === 'number';
  const isGraphWidth = graphWidth > 0;
  if (!isNumber || !isGraphWidth) {
    return 0;
  }
  const oneMonthWidth = graphWidth / maxMonths;
  let offsetX = oneMonthWidth * months;
  if (months === 1) {
    offsetX = 0;
  }
  if (months === maxMonths) {
    offsetX = graphWidth - lineWidth;
  }
  return offsetX;
};

/**
 * @param value {number}
 * @param apr {number}
 * @param months {number}
 * @returns {number}
 */
export const getExpectedAmount = (value = 0, apr = 0, months = 0) => {
  const valueMultiplyApr = value * apr;
  const valueDividedOneYearMonths = valueMultiplyApr / MONTHS_IN_YEAR;
  const valueMultiplyMonths = valueDividedOneYearMonths * months;
  const currentValue = valueMultiplyMonths + value;
  const currentValueFixed = toFixed(currentValue, 2);
  return !Number.isNaN(currentValue) ? Number(currentValueFixed) : 0;
};

/**
 * @param months {number}
 * @returns {string}
 */
export const getExpectedUntilDate = (months = 0) => {
  const newDate = new Date();
  const newDateMonth = newDate.getMonth();
  newDate.setMonth(newDateMonth + months);
  return formatDate(newDate, 'MMMM dd,yyyy');
};

/**
 * @param width {number}
 * @param offsetX {number}
 * @returns {number|number}
 */
export const getGraphOffsetXPercent = (width, offsetX) => {
  const onePercent = width / 100;
  const currentPercent = offsetX / onePercent;
  return !Number.isNaN(currentPercent) && Number.isFinite(currentPercent)
    ? currentPercent
    : 0;
};

/**
 * @param value {number}
 * @param apr {number}
 * @param months {number}
 * @param elementWidth {number}
 * @param maxMonths {number}
 * @param graphLineWidth {number}
 * @returns {{expectedUntilDate: string, newExpectedAmount: number, newGraphOffsetXPercent: number}}
 */
export const getGraphDefaultDate = (
  value,
  apr,
  months,
  elementWidth,
  maxMonths,
  graphLineWidth,
) => {
  const newExpectedAmount = getExpectedAmount(value, apr, months);
  const expectedUntilDate = getExpectedUntilDate(months);
  const graphOffsetX = getStakingGraphOffsetX(
    elementWidth,
    months,
    maxMonths,
    graphLineWidth,
  );
  const newGraphOffsetXPercent = getGraphOffsetXPercent(elementWidth, graphOffsetX);
  return {
    newGraphOffsetXPercent,
    newExpectedAmount,
    expectedUntilDate,
  };
};

/**
 * @param elementWidth {number}
 * @param maxMonths {number}
 * @param offsetX {number}
 * @returns {number|number}
 */
export const getMonths = (elementWidth, maxMonths, offsetX) => {
  const oneMonthNumber = elementWidth / maxMonths;
  const monthsNumber = offsetX / oneMonthNumber;
  const monthsNumberCeil = Math.ceil(monthsNumber);
  return !Number.isNaN(monthsNumberCeil) && Number.isFinite(monthsNumberCeil)
    ? monthsNumberCeil
    : 0;
};
