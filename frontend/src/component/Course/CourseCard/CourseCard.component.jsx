import React from 'react';
import { Link } from 'react-router-dom';
import './CourseCard.scss';

const CourseCard = ({ course }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getCourseStatus = () => {
        const now = new Date();
        const start = new Date(course.startDate);
        const end = new Date(course.endDate);

        if (now < start) return { label: 'Nadchodzący', className: 'upcoming' };
        if (now > end) return { label: 'Zakończony', className: 'completed' };
        return { label: 'Aktywny', className: 'active' };
    };

    const status = getCourseStatus();

    return (
        <Link to={`/courses/${course.id}/structure`} className="course-card">
            <div className="card-header">
                <div className="course-title-section">
                    <h3 className="course-title">{course.name}</h3>
                    {course.isPasswordProtected && (
                        <span className="lock-icon" title="Kurs chroniony hasłem">
                            🔒
                        </span>
                    )}
                </div>
                <span className={`status-badge ${status.className}`}>
                    {status.label}
                </span>
            </div>

            <p className="course-description">{course.description}</p>

            <div className="card-footer">
                <div className="course-info-item">
                    <span className="info-icon">👤</span>
                    <span className="info-text">
                        {course.owner.firstName} {course.owner.lastName}
                    </span>
                </div>

                <div className="course-info-item">
                    <span className="info-icon">👥</span>
                    <span className="info-text">
                        {course.participantsCount} {course.participantsCount === 1 ? 'uczestnik' : 'uczestników'}
                    </span>
                </div>

                <div className="course-dates">
                    <div className="date-item">
                        <span className="date-label">Start:</span>
                        <span className="date-value">{formatDate(course.startDate)}</span>
                    </div>
                    <div className="date-item">
                        <span className="date-label">Koniec:</span>
                        <span className="date-value">{formatDate(course.endDate)}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CourseCard;