import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../Button';

const ParticipantsHeader = ({ count, onAddClick, userRole }) => {
    const { t } = useTranslation();
    const canManage = userRole === 'Admin' || userRole === 'Teacher';

    return (
        <div className="participants-header">
            <h2 className="section-title">{t('course.participants_header', { count })}</h2>
            {canManage && (
                <Button
                    variant="primary"
                    onClick={onAddClick}
                    size="medium"
                >
                    {t('course.add_participant')}
                </Button>
            )}
        </div>
    );
};

export default ParticipantsHeader;