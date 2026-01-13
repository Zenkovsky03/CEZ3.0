import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../AdminUsersPageNew.scss';

const Breadcrumb = ({ items }) => {
    const navigate = useNavigate();

    return (
        <div className="admin-users__breadcrumb">
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    {index > 0 && <span className="admin-users__breadcrumb-separator">/</span>}
                    {item.path ? (
                        <button
                            onClick={() => navigate(item.path)}
                            className="admin-users__breadcrumb-link"
                        >
                            {item.label}
                        </button>
                    ) : (
                        <span className="admin-users__breadcrumb-current">{item.label}</span>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default Breadcrumb;
