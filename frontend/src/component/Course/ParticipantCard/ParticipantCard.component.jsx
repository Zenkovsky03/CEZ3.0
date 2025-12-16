import React from 'react';
import Avatar from '../../Avatar';
import RoleBadge from '../../RoleBadge';
import Button from '../../Button';

const ParticipantCard = ({ participant, formattedDate, onRemove }) => {
    return (
        <div className="participant-card">
            <Avatar
                firstName={participant.firstName}
                lastName={participant.lastName}
                size="medium"
            />

            <div className="participant-info">
                <div className="participant-name">
                    {participant.firstName} {participant.lastName}
                </div>
                <div className="participant-email">
                    {participant.email}
                </div>
                <div className="participant-meta">
                    <RoleBadge role={participant.role} />
                    {formattedDate && (
                        <span className="enrollment-date">
                            Dołączył {formattedDate}
                        </span>
                    )}
                </div>
            </div>

            <div className="participant-actions">
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