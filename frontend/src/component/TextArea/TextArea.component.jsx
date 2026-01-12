// TextArea/TextArea.component.jsx
import React from 'react';
import './TextArea.scss';

const TextArea = ({
                      label,
                      name,
                      value,
                      onChange,
                      placeholder,
                      rows = 3,
                      required = false,
                      error,
                      disabled = false
                  }) => {
    return (
        <label className="field-label">
            {label && (
                <p className="input-label-text">
                    {label}
                    {required && <span className="required">*</span>}
                </p>
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
                className={`form-input ${error ? 'error' : ''}`}
            />
            {error && <span className="error-message">{error}</span>}
        </label>
    );
};

export default TextArea;