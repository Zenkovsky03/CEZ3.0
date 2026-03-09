import React, { useCallback, useEffect, useState } from 'react';
import AddParticipantModal from './AddParticipantModal.component';
import './AddParticipantModal.scss';

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
    }, [searchQuery, searchUsers]);

    // Reset when modal closes
    useEffect(() => {
        if (!isOpen) {
            setSearchQuery('');
            setSearchResults([]);
        }
    }, [isOpen]);

    const searchUsers = useCallback(async (query) => {
        try {
            setLoading(true);

            // TODO: If backend exposes dedicated user search, replace this call.
            const response = await fetch('/api/user/ByRole?r=Student');
            const users = await response.json();
            const lowerQuery = query.toLowerCase();
            const filtered = (Array.isArray(users) ? users : []).filter(user => {
                const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
                const email = user.email.toLowerCase();
                const username = user.username.toLowerCase();

                return fullName.includes(lowerQuery) ||
                    email.includes(lowerQuery) ||
                    username.includes(lowerQuery);
            }).filter(
                // Exclude already existing participants
                user => !existingParticipants.some(p => p.id === user.id)
            );

            setSearchResults(filtered);
        } catch (error) {
            console.error('Error searching users:', error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    }, [existingParticipants]);

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
