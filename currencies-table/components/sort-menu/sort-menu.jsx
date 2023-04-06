import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import SortArrowIcon from '../icons/sort-arrow-icon';
import SortMenuItem from '../sort-menu-item';

const MENU_SORT_RANK = 'rank';
const MENU_SORT_ABC = 'abc';

const SortMenu = (props) => {
  const {
    className,
    title,
    onClick,
    isOpen,
    onSortedMode,
    sortedMode,
    dropdownRef,
  } = props;

  const handleToggle = () => {
    if (typeof onClick === 'function') {
      onClick();
    }
  };

  return (
    <div className={cn([
      'sort-menu',
      isOpen && 'sort-menu__opened',
      className,
    ])}
    >
      {title && (
        <div
          className="sort-menu__text"
          onClick={handleToggle}
          onKeyPress={handleToggle}
          role="button"
          tabIndex={0}
        >
          {title}
          <SortArrowIcon />
        </div>
      )}
      {isOpen && (
        <div className="sort-menu__dropdown" ref={dropdownRef}>
          <SortMenuItem
            onMode={onSortedMode}
            sortedMode={sortedMode}
            sortedType={MENU_SORT_RANK}
          >
            Rank
          </SortMenuItem>
          <SortMenuItem
            onMode={onSortedMode}
            sortedMode={sortedMode}
            sortedType={MENU_SORT_ABC}
          >
            A &gt; Z
          </SortMenuItem>
        </div>
      )}
    </div>
  );
};

SortMenu.defaultProps = {
  className: null,
  title: null,
  onClick: null,
  isOpen: false,
  onSortedMode: null,
  sortedMode: null,
  dropdownRef: null,
};

SortMenu.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func,
  isOpen: PropTypes.bool,
  onSortedMode: PropTypes.func,
  sortedMode: PropTypes.string,
  dropdownRef: PropTypes.objectOf(PropTypes.any),
};

export default React.memo(SortMenu);
