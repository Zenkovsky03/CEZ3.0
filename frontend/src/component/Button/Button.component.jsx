import React from 'react';

const Button = ({
                    children,
                    type = 'button',
                    variant = 'primary', // 'primary' | 'secondary' | 'tertiary'
                    onClick,
                    disabled = false,
                    fullWidth = false,
                    size = 'medium', // 'small' | 'medium' | 'large'
                    icon,
                    className = ''
                }) =>
{
    const buttonClasses = [
        'button',
        `button-${variant}`,
        `button-${size}`,
        fullWidth ? 'button-full-width' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={buttonClasses}
        >
            {icon && <span className="button-icon">{icon}</span>}
            <span className="button-text">{children}</span>
        </button>
    );
};

export default Button;