import React from 'react';
import Avatar from '../../Avatar';
import RoleBadge from '../../RoleBadge';
import Button from '../../Button';

const ParticipantCard = ({ participant, formattedDate, onRemove }) => {
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
                        <span className="enrollment-date">Dołączył {formattedDate}</span>
                    </div>
                )}
            </div>

            <div className="participant-card-footer">
                <Button
                    variant="secondary"
                    size="small"
                    onClick={onRemove}
                >
                    Usuń
                </Button>
            </div>
        </div>
    );
};

export default ParticipantCard;