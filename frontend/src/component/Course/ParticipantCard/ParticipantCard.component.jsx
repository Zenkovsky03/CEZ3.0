import React from 'react';
import { useTranslation } from 'react-i18next';
import Avatar from '../../Avatar';
import RoleBadge from '../../RoleBadge';
import Button from '../../Button';

const ParticipantCard = ({ participant, formattedDate, onRemove, userRole }) => {
    const { t } = useTranslation();
    const canManage = userRole === 'Admin' || userRole === 'Teacher';
    return (
        <div className="participant-card">
            <div className="participant-card-header">
                <Avatar
                    firstName={participant.firstName}
                    lastName={participant.lastName}
                    size="medium"
                />

                <div className="participant-header-info">
                    <div className="participant-name">
                        {participant.firstName} {participant.lastName}
                    </div>
                    <RoleBadge role={participant.role} />
                </div>
            </div>

            <div className="participant-card-body">
                <div className="participant-detail">
                    <span className="detail-icon">✉️</span>
                    <span className="participant-email">{participant.email}</span>
                </div>

                {formattedDate && (
                    <div className="participant-detail">
                        <span className="detail-icon">📅</span>
                        <span className="enrollment-date">{t('course.enrolled_date', { date: formattedDate })}</span>
                    </div>
                )}
            </div>

            {canManage && (
                <div className="participant-card-footer">
                    <Button
                        variant="secondary"
                        size="small"
                        onClick={onRemove}
                    >
                        {t('common.delete')}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ParticipantCard;