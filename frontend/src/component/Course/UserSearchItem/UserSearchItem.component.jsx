import React from 'react';
import { useTranslation } from 'react-i18next';
import Avatar from '../../Avatar';
import Button from '../../Button';

const UserSearchItem = ({ user, onAdd, isAlreadyAdded }) => {
    const { t } = useTranslation();
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
                    <span className="already-added">{t('admin.already_added')}</span>
                ) : (
                    <Button
                        variant="primary"
                        size="small"
                        onClick={() => onAdd(user.id)}
                    >
                        {t('common.add')}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default UserSearchItem;