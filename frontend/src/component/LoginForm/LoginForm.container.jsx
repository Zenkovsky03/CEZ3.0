import React, { useState } from 'react';
import LoginForm from './LoginForm.component';
import './LoginForm.scss';

const LoginFormContainer = () => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    return <LoginForm showPassword={showPassword} togglePasswordVisibility={togglePasswordVisibility} />;
};

export default LoginFormContainer;
