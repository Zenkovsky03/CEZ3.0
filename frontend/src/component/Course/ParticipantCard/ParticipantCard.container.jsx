import React from 'react';
import ParticipantCard from './ParticipantCard.component';
//import './ParticipantCard.scss';

const ParticipantCardContainer = ({ participant, onRemove }) => {
    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleRemove = () => {
        onRemove(participant.id);
    };

    const formattedDate = formatDate(participant.enrollmentDate);

    return (
        <ParticipantCard
            participant={participant}
            formattedDate={formattedDate}
            onRemove={handleRemove}
        />
    );
};

export default ParticipantCardContainer;