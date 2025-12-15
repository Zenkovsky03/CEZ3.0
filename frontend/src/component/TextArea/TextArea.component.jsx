import React from 'react';

const TextArea = ({
                      label, name, value, onChange, placeholder,
                      rows = 3, required = false,
                      error, disabled = false}) =>
{
    return (
        <div className="textarea-wrapper">
            {label && (
                <label htmlFor={name} className="textarea-label">
                    {label}
                    {required && <span className="required">*</span>}
                </label>
            )}
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                required={required}
                disabled={disabled}
                className={`textarea-field ${error ? 'error' : ''}`}
            />
            {error && <span className="error-message">{error}</span>}
        </div>
    );
};

export default TextArea;