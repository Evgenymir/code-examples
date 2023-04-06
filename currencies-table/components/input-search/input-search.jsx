import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import SearchIcon from '../icons/search-icon';

const InputSearch = (props) => {
  const {
    className,
    onChange,
    placeholder,
    Icon,
    isDarkTheme,
  } = props;

  const handleChange = (event) => {
    if (typeof onChange === 'function') {
      onChange(event.target.value);
    }
  };

  return (
    <div className={cn([
      'input-search',
      isDarkTheme && 'input-search_dark-theme',
      className,
    ])}
    >
      <input
        onChange={handleChange}
        className="input-search__input"
        placeholder={placeholder}
        type="text"
      />
      {Icon || <SearchIcon className="input-search__icon" />}
    </div>
  );
};

InputSearch.defaultProps = {
  className: null,
  onChange: null,
  placeholder: null,
  Icon: null,
  isDarkTheme: false,
};

InputSearch.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  Icon: PropTypes.element,
  isDarkTheme: PropTypes.bool,
};

export default InputSearch;
