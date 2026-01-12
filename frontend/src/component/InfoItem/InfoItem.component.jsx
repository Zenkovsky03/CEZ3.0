import React from 'react';
import './InfoItem.scss';

const InfoItem = ({ label, value, children }) => {
    return (
        <div className="info-item">
            <span className="info-label">{label}</span>
            <div className="info-value">
                {children || value}
            </div>
        </div>
    );
};

export default InfoItem;