import React from 'react';

const DateField = ({
                       label, name, value, onChange,
                       required = false, error,
                       disabled = false, min, max}) =>
{
    return (
        <div className="date-field-wrapper">
            {label && (
                <label htmlFor={name} className="date-field-label">
                    {label}
                    {required && <span className="required">*</span>}
                </label>
            )}
            <input
                id={name}
                type="date"
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                min={min}
                max={max}
                className={`date-field-input ${error ? 'error' : ''}`}
            />
            {error && <span className="error-message">{error}</span>}
        </div>
    );
};

export default DateField;