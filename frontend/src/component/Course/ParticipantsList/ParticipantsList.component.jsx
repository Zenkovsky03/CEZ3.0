import React from 'react';
import { useTranslation } from 'react-i18next';
import ParticipantsHeader from '../ParticipantsHeader';
import SearchBar from '../../SearchBar';
import EmptyState from '../../EmptyState';
import ParticipantCard from '../ParticipantCard';

const ParticipantsList = ({
                              filteredParticipants,
                              totalCount,
                              searchQuery,
                              onSearchChange,
                              onRemove,
                              onAddClick,
                              userRole
                          }) => {
    const { t } = useTranslation();

    return (
        <div className="participants-list">
            <ParticipantsHeader
                count={totalCount}
                onAddClick={onAddClick}
                userRole={userRole}
            />

            <SearchBar
                value={searchQuery}
                onChange={onSearchChange}
                placeholder={t('course.search_participant')}
            />

            {filteredParticipants.length === 0 ? (
                <EmptyState
                    message={searchQuery
                        ? t('course.no_participants_found')
                        : t('course.no_participants')
                    }
                    icon="👥"
                />
            ) : (
                <div className="participants-grid">
                    {filteredParticipants.map(participant => (
                        <ParticipantCard
                            key={participant.id}
                            participant={participant}
                            onRemove={onRemove}
                            userRole={userRole}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ParticipantsList;