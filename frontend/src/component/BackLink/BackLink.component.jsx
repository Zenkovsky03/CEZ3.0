import React from 'react';
import { Link } from 'react-router-dom';
import './BackLink.scss';

const BackLink = ({ to, children, className = '' }) => {
    return (
        <Link to={to} className={`back-link ${className}`}>
            ← {children}
        </Link>
    );
};

export default BackLink;