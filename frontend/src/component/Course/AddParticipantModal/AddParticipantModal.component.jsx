import React from 'react';
import Modal from '../../Modal';
import SearchBar from '../../SearchBar';
import EmptyState from '../../EmptyState';
import UserSearchItem from '../UserSearchItem';

const AddParticipantModal = ({
                                 isOpen,
                                 onClose,
                                 searchQuery,
                                 onSearchChange,
                                 searchResults,
                                 onAdd,
                                 loading,
                                 existingParticipantIds
                             }) => {
    const isAlreadyParticipant = (userId) => {
        return existingParticipantIds.includes(userId);
    };

    const renderContent = () => {
        if (loading) {
            return <EmptyState message="Wyszukiwanie..." />;
        }

        if (!searchQuery || searchQuery.length < 2) {
            return (
                <EmptyState
                    message="Wpisz minimum 2 znaki, aby wyszukać użytkownika"
                    icon="⌨️"
                />
            );
        }

        if (searchResults.length === 0) {
            return <EmptyState message="Nie znaleziono użytkowników" icon="🔍" />;
        }

        return (
            <div className="results-list">
                {searchResults.map(user => (
                    <UserSearchItem
                        key={user.id}
                        user={user}
                        onAdd={onAdd}
                        isAlreadyAdded={isAlreadyParticipant(user.id)}
                    />
                ))}
            </div>
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Dodaj uczestnika" size="medium">
            <div className="add-participant-modal">
                <SearchBar
                    value={searchQuery}
                    onChange={onSearchChange}
                    placeholder="Szukaj po email lub nazwie użytkownika..."
                />
                {renderContent()}
            </div>
        </Modal>
    );
};

export default AddParticipantModal;