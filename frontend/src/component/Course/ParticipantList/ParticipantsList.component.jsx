import React from 'react';
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
                              onAddClick
                          }) => {
    return (
        <div className="participants-list">
            <ParticipantsHeader
                count={totalCount}
                onAddClick={onAddClick}
            />

            <SearchBar
                value={searchQuery}
                onChange={onSearchChange}
                placeholder="Szukaj uczestnika..."
            />

            {filteredParticipants.length === 0 ? (
                <EmptyState
                    message={searchQuery
                        ? 'Nie znaleziono uczestników'
                        : 'Brak uczestników w kursie'
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
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ParticipantsList;