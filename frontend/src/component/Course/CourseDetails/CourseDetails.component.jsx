import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../../context/AuthContext';
import Header from '../../Header';
import CourseHeader from '../CourseHeader';
import CourseInfo from '../CourseInfo';
import ParticipantsList from '../ParticipantsList';

const CourseDetails = ({
                           course,
                           participants,
                           loading,
                           error,
                           onRemoveParticipant,
                           onAddParticipant
                       }) => {
    const { user } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="page-wrapper-course-details">
                <Header variant="dashboard" />
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Ładowanie kursu...</p>
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="page-wrapper-course-details">
                <Header variant="dashboard" />
                <div className="error-container">
                    <p>{error || 'Nie znaleziono kursu'}</p>
                    <Link to="/courses" className="link">Powrót do listy kursów</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper-course-details">
            <Header variant="dashboard" />
            <div className="main-content">
                <div className="course-details-wrapper">
                    <div className="course-details-header-row">
                        <CourseHeader
                            name={course.name}
                            description={course.description}
                            id={course.id}
                        />
                        {user?.role === 'Admin' && (
                            <Link to={`/courses/${course.id}/edit`} className="btn-edit-course">
                                <span className="material-symbols-outlined">edit</span>
                                Edytuj kurs
                            </Link>
                        )}
                    </div>

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