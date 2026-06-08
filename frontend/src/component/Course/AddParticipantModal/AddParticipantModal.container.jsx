import React, { useCallback, useEffect, useRef, useState } from 'react';
import AddParticipantModal from './AddParticipantModal.component';
import { getUsersByRole } from '../../../services/userService';
import './AddParticipantModal.scss';

const AddParticipantModalContainer = ({ isOpen, onClose, onAdd, existingParticipants }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const existingIdsRef = useRef([]);

    useEffect(() => {
        existingIdsRef.current = (existingParticipants || []).map(p => p.id);
    }, [existingParticipants]);

    const searchUsers = useCallback(async (query) => {
        try {
            setLoading(true);

            const roles = ['Student', 'Teacher'];
            const results = await Promise.allSettled(
                roles.map(r => getUsersByRole(r))
            );
            const users = results
                .filter(r => r.status === 'fulfilled')
                .flatMap(r => r.value);
            const lowerQuery = query.toLowerCase();
            const existingIds = existingIdsRef.current;
            const filtered = (Array.isArray(users) ? users : []).filter(user => {
                const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
                const email = (user.email || '').toLowerCase();
                const username = (user.username || '').toLowerCase();

                return fullName.includes(lowerQuery) ||
                    email.includes(lowerQuery) ||
                    username.includes(lowerQuery);
            }).filter(
                user => !existingIds.includes(user.id)
            );

            setSearchResults(filtered);
        } catch (error) {
            console.error('Error searching users:', error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

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

    const existingParticipantIds = (existingParticipants || []).map(p => p.id);

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
