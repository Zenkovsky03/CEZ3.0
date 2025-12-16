import React from 'react';
import './SearchBar.scss';

const SearchBar = ({
                       value,
                       onChange,
                       placeholder = 'Szukaj...',
                       className = ''
                   }) => {
    return (
        <div className={`search-bar ${className}`}>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="search-input"
            />
        </div>
    );
};

export default SearchBar;