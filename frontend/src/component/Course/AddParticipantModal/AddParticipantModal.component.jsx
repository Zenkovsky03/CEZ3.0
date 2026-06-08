import React from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
    const isAlreadyParticipant = (userId) => {
        return (existingParticipantIds || []).includes(userId);
    };

    const renderContent = () => {
        if (loading) {
            return <EmptyState message={t('add_participant.searching')} />;
        }

        if (!searchQuery || searchQuery.length < 2) {
            return (
                <EmptyState
                    message={t('add_participant.min_chars')}
                    icon="⌨️"
                />
            );
        }

        if (searchResults.length === 0) {
            return <EmptyState message={t('add_participant.not_found')} icon="🔍" />;
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
        <Modal isOpen={isOpen} onClose={onClose} title={t('add_participant.title')} size="medium">
            <div className="add-participant-modal">
                <SearchBar
                    value={searchQuery}
                    onChange={onSearchChange}
                    placeholder={t('add_participant.search_placeholder')}
                />
                {renderContent()}
            </div>
        </Modal>
    );
};

export default AddParticipantModal;