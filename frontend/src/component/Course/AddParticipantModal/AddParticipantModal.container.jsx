// AddParticipantModal/AddParticipantModal.container.jsx
import React, { useState, useEffect } from 'react';
import AddParticipantModal from './AddParticipantModal.component';
//import './AddParticipantModal.scss';

const AddParticipantModalContainer = ({ isOpen, onClose, onAdd, existingParticipants }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // Debounce search
    useEffect(() => {
        if (!searchQuery || searchQuery.length < 2) {
            setSearchResults([]);
            return;
        }

        const timeoutId = setTimeout(() => {
            searchUsers(searchQuery);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Reset when modal closes
    useEffect(() => {
        if (!isOpen) {
            setSearchQuery('');
            setSearchResults([]);
        }
    }, [isOpen]);

    const searchUsers = async (query) => {
        try {
            setLoading(true);
            const response = await fetch(
                `${1}/users?search=${encodeURIComponent(query)}`
            );

            if (response.ok) {
                const data = await response.json();
                // Filter out users who are already participants
                const filtered = data.filter(
                    user => !existingParticipants.some(p => p.id === user.id)
                );
                setSearchResults(filtered);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Error searching users:', error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const existingParticipantIds = existingParticipants.map(p => p.id);

    return (
        <AddParticipantModal
            isOpen={isOpen}
            onClose={onClose}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchResults={searchResults}
            onAdd={onAdd}
            loading={loading}
            existingParticipantIds={existingParticipantIds}
        />
    );
};

export default AddParticipantModalContainer;