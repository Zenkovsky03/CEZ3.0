import React, { useState } from 'react';
import PasswordField from './PasswordField.component';
import './PasswordField.scss';

const PasswordFieldContainer = ({ label, placeholder, confirm = false, name, required = false }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => setShowPassword(prev => !prev);

    return <PasswordField label={label} placeholder={placeholder} confirm={confirm} showPassword={showPassword} togglePassword={togglePassword} name={name} required={required} />;
};

export default PasswordFieldContainer;
