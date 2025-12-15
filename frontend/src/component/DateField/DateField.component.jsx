import React from 'react';
import './DateField.scss';

const DateField = ({
                       label,
                       name,
                       value,
                       onChange,
                       required = false,
                       error,
                       disabled = false,
                       min,
                       max
                   }) => {
    return (
        <label className="field-label">
            {label && (
                <p className="input-label-text">
                    {label}
                    {required && <span className="required">*</span>}
                </p>
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
                className={`form-input ${error ? 'error' : ''}`}
            />
            {error && <span className="error-message">{error}</span>}
        </label>
    );
};

export default DateField;