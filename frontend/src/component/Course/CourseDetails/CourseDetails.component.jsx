import React from 'react';
import { Link } from 'react-router-dom';
import CourseHeader from '../CourseHeader';
import CourseInfo from '../CourseInfo';
import ParticipantsList from '../ParticipantList';

const CourseDetails = ({
                           course,
                           participants,
                           loading,
                           error,
                           onRemoveParticipant,
                           onAddParticipant
                       }) => {
    if (loading) {
        return (
            <div className="page-wrapper-course-details">
                <div className="loading-container">
                    <p>Ładowanie...</p>
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="page-wrapper-course-details">
                <div className="error-container">
                    <p>{error || 'Nie znaleziono kursu'}</p>
                    <Link to="/courses" className="link">Powrót do listy kursów</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper-course-details">
            <div className="main-content">
                <div className="course-details-wrapper">
                    <CourseHeader
                        name={course.name}
                        description={course.description}
                    />

                    <div className="course-info-section">
                        <CourseInfo
                            course={course}
                            participantsCount={participants.length}
                        />
                    </div>

                    <div className="participants-section">
                        <ParticipantsList
                            participants={participants}
                            onRemove={onRemoveParticipant}
                            onAdd={onAddParticipant}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;