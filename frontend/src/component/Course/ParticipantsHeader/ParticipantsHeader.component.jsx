import React from 'react';
import Button from '../../Button';

const ParticipantsHeader = ({ count, onAddClick }) => {
    return (
        <div className="participants-header">
            <h2 className="section-title">👥 Uczestnicy kursu ({count})</h2>
            <Button
                variant="primary"
                onClick={onAddClick}
                size="medium"
            >
                + Dodaj uczestnika
            </Button>
        </div>
    );
};

export default ParticipantsHeader;