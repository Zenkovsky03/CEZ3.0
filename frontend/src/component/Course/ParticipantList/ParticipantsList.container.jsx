import React, { useState } from 'react';
import ParticipantsList from './ParticipantsList.component';
import AddParticipantModal from '../AddParticipantModal';
import './ParticipantsList.scss';

const ParticipantsListContainer = ({ participants, onRemove, onAdd }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filterParticipants = () => {
        return participants.filter(participant => {
            const fullName = `${participant.firstName} ${participant.lastName}`.toLowerCase();
            const email = participant.email.toLowerCase();
            const query = searchQuery.toLowerCase();

            return fullName.includes(query) || email.includes(query);
        });
    };

    const handleAddClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleAddParticipant = async (userId) => {
        await onAdd(userId);
        setIsModalOpen(false);
    };

    const filteredParticipants = filterParticipants();

    return (
        <>
            <ParticipantsList
                filteredParticipants={filteredParticipants}
                totalCount={participants.length}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onRemove={onRemove}
                onAddClick={handleAddClick}
            />

            <AddParticipantModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onAdd={handleAddParticipant}
                existingParticipants={participants}
            />
        </>
    );
};

export default ParticipantsListContainer;