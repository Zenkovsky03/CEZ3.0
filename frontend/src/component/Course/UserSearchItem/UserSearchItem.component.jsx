import React from 'react';
import Avatar from '../../Avatar';
import Button from '../../Button';

const UserSearchItem = ({ user, onAdd, isAlreadyAdded }) => {
    return (
        <div className="user-search-item">
            <Avatar
                firstName={user.firstName}
                lastName={user.lastName}
                size="small"
            />
            <div className="user-info">
                <div className="user-name">
                    {user.firstName} {user.lastName}
                </div>
                <div className="user-email">{user.email}</div>
                <div className="user-username">@{user.username}</div>
            </div>
            <div className="user-actions">
                {isAlreadyAdded ? (
                    <span className="already-added">Już dodany</span>
                ) : (
                    <Button
                        variant="primary"
                        size="small"
                        onClick={() => onAdd(user.id)}
                    >
                        Dodaj
                    </Button>
                )}
            </div>
        </div>
    );
};

export default UserSearchItem;