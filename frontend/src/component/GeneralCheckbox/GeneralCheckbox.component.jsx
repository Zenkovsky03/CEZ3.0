import React from 'react';

const GeneralCheckbox = ({
                      name,
                      label,
                      checked,
                      onChange,
                      disabled = false,
                      error
                  }) => {
    const handleChange = (e) => {
        if (onChange) {
            // Pass an event with value as boolean for easier handling
            onChange({
                target: {
                    name: e.target.name,
                    value: e.target.checked
                }
            });
        }
    };

    return (
        <div className="checkbox-wrapper">
            <label className={`checkbox-label ${disabled ? 'disabled' : ''}`}>
                <input
                    type="checkbox"
                    name={name}
                    checked={checked}
                    onChange={handleChange}
                    disabled={disabled}
                    className={`checkbox-input ${error ? 'error' : ''}`}
                />
                <span className="checkbox-text">{label}</span>
            </label>
            {error && <span className="error-message">{error}</span>}
        </div>
    );
};

export default GeneralCheckbox;