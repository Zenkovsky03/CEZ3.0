import React, { useState, useEffect } from 'react';
import AddParticipantModal from './AddParticipantModal.component';
import './AddParticipantModal.scss';

// MOCK USERS FOR SEARCH
const MOCK_USERS = [
    {
        id: 'user5',
        firstName: 'Katarzyna',
        lastName: 'Kamińska',
        email: 'katarzyna.kaminska@example.com',
        username: 'kkaminska',
        role: 'Student'
    },
    {
        id: 'user6',
        firstName: 'Marek',
        lastName: 'Kowalczyk',
        email: 'marek.kowalczyk@example.com',
        username: 'mkowalczyk',
        role: 'Student'
    },
    {
        id: 'user7',
        firstName: 'Magdalena',
        lastName: 'Mazur',
        email: 'magdalena.mazur@example.com',
        username: 'mmazur',
        role: 'Student'
    },
    {
        id: 'user8',
        firstName: 'Paweł',
        lastName: 'Krawczyk',
        email: 'pawel.krawczyk@example.com',
        username: 'pkrawczyk',
        role: 'Teacher'
    }
];

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
    }, [searchQuery, existingParticipants]);

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

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 300));

            // Mock search: filter by name, email, or username
            const lowerQuery = query.toLowerCase();
            const filtered = MOCK_USERS.filter(user => {
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