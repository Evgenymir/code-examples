import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import StakingCalculatorRangeField from '../staking-calculator-range-field';
import { getPriceToFiat } from '../../../../helpers/get-price-to-fiat';
import toFixed from '../../../../helpers/to-fixed';
import toFormat from '../../../../helpers/to-format';
import StakingCalculatorChartIcon from '../../../icons/staking-calculator-chart-icon';
import Button from '../../../button';
import { useMediaQuery } from '../../../../hooks/use-media-query';
import StakingCalculatorInfo from '../staking-calculator-info';
import { MONTHS_IN_YEAR } from '../../../../constants/datetime-constants';
import {
  getExpectedAmount,
  getExpectedUntilDate,
  getGraphDefaultDate,
  getGraphOffsetXPercent,
  getMonths,
  getStakingGraphOffsetX,
} from './staking-calculator-helpers';
import { WALLET_ONE_LINK } from '../../../../constants';

const GRAPH_LINE_WIDTH = 3;
const MONTHS_IN_THREE_YEARS = MONTHS_IN_YEAR * 3;

const BUTTONS = [{
  id: 1,
  name: '1 Month',
  month: 1,
}, {
  id: 2,
  name: '6 Month',
  month: 6,
}, {
  id: 3,
  name: '12 Month',
  month: 12,
}, {
  id: 4,
  name: '24 Month',
  month: 24,
}, {
  id: 5,
  name: '36 Month',
  month: 36,
}];

const StakingCalculator = (props) => {
  const {
    className,
    coinImage,
    ticker,
    price,
    onClick,
    apr,
    fetching,
    minAmount,
    maxAmount,
    defaultAmount,
    defaultMonths,
    stepAmount,
  } = props;

  const isDesktop = useMediaQuery('(min-width: 992px)');
  const graphRef = React.useRef(null);

  const [graphOffsetXPercent, setGraphOffsetXPercent] = React.useState(0);
  const [graphWidth, setGraphWidth] = React.useState(0);
  const [rangeValue, setRangeValue] = React.useState(`${defaultAmount}`);
  const [monthNumber, setMonthNumber] = React.useState(defaultMonths);
  const [expectedAmount, setExpectedAmount] = React.useState(0);

  const valueToUsd = getPriceToFiat(Number(rangeValue), price);
  const valueToUsdFixed = toFixed(valueToUsd, 2);
  const valueToUsdFormatted = toFormat(valueToUsdFixed, '');
  const expectedAmountFormatted = toFormat(expectedAmount, '');
  const expectedAmountToUsd = getPriceToFiat(expectedAmount, price);
  const expectedAmountToUsdFixed = toFixed(expectedAmountToUsd, 2);
  const expectedAmountToUsdFormatted = toFormat(expectedAmountToUsdFixed, '');
  const [expectedDateText, setExpectedDateText] = React.useState('');

  const handleResize = (element) => () => {
    setGraphWidth(element.clientWidth);
  };
  const handleRangeChange = (value) => {
    setRangeValue(value);
  };
  const handleInputBlur = () => {
    if (!rangeValue || rangeValue < minAmount) {
      setRangeValue(minAmount);
    }
  };
  const handleInputChange = (event) => {
    if (Number(event.target.value) < 0) return;
    const inputtedAmount = parseInt(event.target.value, 10);
    const inputAmountValue = inputtedAmount > maxAmount ? maxAmount : inputtedAmount;
    setRangeValue(inputAmountValue);
  };
  const handleMonthButtonClick = (number) => () => {
    setMonthNumber(number);
  };
  const handleMouseLeaveOnGraph = (event) => {
    const elementWidth = event.currentTarget.offsetWidth;
    const graphDefaultDate = getGraphDefaultDate(
      Number(rangeValue),
      apr,
      monthNumber,
      elementWidth,
      MONTHS_IN_THREE_YEARS,
      GRAPH_LINE_WIDTH,
    );
    setGraphOffsetXPercent(graphDefaultDate.newGraphOffsetXPercent);
    setExpectedAmount(graphDefaultDate.newExpectedAmount);
    setExpectedDateText(graphDefaultDate.expectedUntilDate);
  };
  const handleTouchEndOnGraph = (event) => {
    const elementWidth = event.currentTarget.offsetWidth;
    const graphDefaultDate = getGraphDefaultDate(
      Number(rangeValue),
      apr,
      monthNumber,
      elementWidth,
      MONTHS_IN_THREE_YEARS,
      GRAPH_LINE_WIDTH,
    );
    setGraphOffsetXPercent(graphDefaultDate.newGraphOffsetXPercent);
    setExpectedAmount(graphDefaultDate.newExpectedAmount);
    setExpectedDateText(graphDefaultDate.expectedUntilDate);
  };
  const handleTouchMoveOnGraph = (event) => {
    const element = event.currentTarget;
    const elementWidth = element?.offsetWidth;
    const elementBoundingClientRect = element?.getBoundingClientRect() ?? {};
    const elementPositionLeft = elementBoundingClientRect?.left ?? 0;
    const positionPageX = event?.targetTouches?.[0]?.pageX;
    const graphOffsetX = positionPageX - elementPositionLeft;
    const newGraphOffsetXPercent = getGraphOffsetXPercent(elementWidth, graphOffsetX);
    const months = getMonths(elementWidth, MONTHS_IN_THREE_YEARS, graphOffsetX);
    const nextExpectedAmount = getExpectedAmount(Number(rangeValue), apr, months);
    const expectedUntilDate = getExpectedUntilDate(months);
    setGraphOffsetXPercent(newGraphOffsetXPercent);
    setExpectedAmount(nextExpectedAmount);
    setExpectedDateText(expectedUntilDate);
  };
  const handleMouseMoveOnGraph = (event) => {
    const elementOffsetX = event.offsetX;
    const elementWidth = event.currentTarget.offsetWidth;
    const elementWidthMinusLineWidth = elementWidth - 3;
    if (elementOffsetX <= 0) {
      setGraphOffsetXPercent(0);
      return;
    }
    if (elementOffsetX >= elementWidthMinusLineWidth) {
      setGraphOffsetXPercent(99);
      return;
    }
    const newGraphOffsetXPercent = getGraphOffsetXPercent(elementWidth, elementOffsetX);
    const months = getMonths(elementWidth, MONTHS_IN_THREE_YEARS, elementOffsetX);
    const nextExpectedAmount = getExpectedAmount(Number(rangeValue), apr, months);
    const expectedUntilDate = getExpectedUntilDate(months);
    setGraphOffsetXPercent(newGraphOffsetXPercent);
    setExpectedAmount(nextExpectedAmount);
    setExpectedDateText(expectedUntilDate);
  };
  const setNextExpectedDate = async () => {
    const expectedUntilDate = getExpectedUntilDate(monthNumber);
    setExpectedDateText(expectedUntilDate);
  };
  const setNextExpectedAmount = async () => {
    const newExpectedAmount = getExpectedAmount(Number(rangeValue), apr, monthNumber);
    setExpectedAmount(newExpectedAmount);
  };
  const setNextGraphOffsetXPercent = async () => {
    const graphOffsetX = getStakingGraphOffsetX(
      graphWidth,
      monthNumber,
      MONTHS_IN_THREE_YEARS,
      GRAPH_LINE_WIDTH,
    );
    const newGraphOffsetXPercent = getGraphOffsetXPercent(graphWidth, graphOffsetX);
    setGraphOffsetXPercent(newGraphOffsetXPercent);
  };

  React.useEffect(() => {
    const timerId = setTimeout(setNextExpectedDate, 0);
    return () => {
      clearTimeout(timerId);
    };
  }, [monthNumber]);

  React.useEffect(() => {
    const graphElement = graphRef.current;
    let timerId = null;
    if (graphElement) {
      timerId = setTimeout(() => setGraphWidth(graphElement.offsetWidth));
      window.addEventListener('resize', handleResize(graphElement));
      if (isDesktop) {
        graphElement.addEventListener('mousemove', handleMouseMoveOnGraph);
        graphElement.addEventListener('mouseleave', handleMouseLeaveOnGraph);
      }
      if (!isDesktop) {
        graphElement.addEventListener('touchmove', handleTouchMoveOnGraph);
        graphElement.addEventListener('touchend', handleTouchEndOnGraph);
      }
    }
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
      if (graphElement) {
        window.removeEventListener('resize', handleResize);
        if (isDesktop) {
          graphElement.removeEventListener('mousemove', handleMouseMoveOnGraph);
          graphElement.removeEventListener('mouseleave', handleMouseLeaveOnGraph);
        }
        if (!isDesktop) {
          graphElement.removeEventListener('touchmove', handleTouchMoveOnGraph);
          graphElement.removeEventListener('touchend', handleTouchEndOnGraph);
        }
      }
    };
  }, [
    graphRef,
    rangeValue,
    apr,
    monthNumber,
    isDesktop,
  ]);

  React.useEffect(() => {
    const timerId = setTimeout(setNextExpectedAmount, 0);
    return () => {
      clearTimeout(timerId);
    };
  }, [
    rangeValue,
    apr,
    monthNumber,
  ]);

  React.useEffect(() => {
    const timerId = setTimeout(setNextGraphOffsetXPercent, 0);
    return () => {
      clearTimeout(timerId);
    };
  }, [monthNumber, graphWidth]);

  return (
    <div className={cn('staking-calculator', className)}>
      <div className="staking-calculator__box">
        <StakingCalculatorRangeField
          className="staking-calculator__range-field"
          title="You will stake"
          imagePath={coinImage}
          ticker={ticker}
          convertValue={valueToUsdFormatted}
          convertTicker="USD"
          min={minAmount}
          max={maxAmount}
          step={stepAmount}
          onChange={handleInputChange}
          onRangeChange={handleRangeChange}
          onBlur={handleInputBlur}
          value={rangeValue}
          fetching={fetching}
        />
        <div className="staking-calculator__graph">
          <div className="staking-calculator__graph-chart" ref={graphRef}>
            <StakingCalculatorChartIcon offsetXPercent={graphOffsetXPercent} />
          </div>
          <StakingCalculatorInfo
            className="staking-calculator__info"
            date={expectedDateText}
            value={expectedAmountFormatted}
            ticker={ticker}
            convertValue={expectedAmountToUsdFormatted}
            convertTicker="usd"
          />
          <div className="staking-calculator__graph-buttons">
            {BUTTONS.map((button) => (
              <button
                className={cn([
                  'staking-calculator__graph-button',
                  button.month === monthNumber && 'staking-calculator__graph-button_active',
                ])}
                key={button.id}
                onClick={handleMonthButtonClick(button.month)}
              >
                {button.name}
              </button>
            ))}
          </div>
        </div>
        {!isDesktop && (
          <Button
            className="button_blue staking-calculator__button"
            href={WALLET_ONE_LINK}
            target="_blank"
            rel="nofollow noreferrer noopener"
          >
            Start earning NOW
          </Button>
        )}
        {isDesktop && (
          <Button
            className="button_blue staking-calculator__button"
            type="button"
            onClick={onClick}
          >
            Start earning NOW
          </Button>
        )}
      </div>
    </div>
  );
};

StakingCalculator.defaultProps = {
  className: null,
  coinImage: null,
  ticker: null,
  price: 0,
  onClick: null,
  apr: 0,
  fetching: false,
  minAmount: 1,
  maxAmount: 100000,
  defaultAmount: 10000,
  defaultMonths: 12,
  stepAmount: 1,
};

StakingCalculator.propTypes = {
  className: PropTypes.string,
  coinImage: PropTypes.string,
  ticker: PropTypes.string,
  price: PropTypes.number,
  apr: PropTypes.number,
  onClick: PropTypes.func,
  fetching: PropTypes.bool,
  minAmount: PropTypes.number,
  maxAmount: PropTypes.number,
  defaultAmount: PropTypes.number,
  defaultMonths: PropTypes.number,
  stepAmount: PropTypes.number,
};

export default StakingCalculator;
