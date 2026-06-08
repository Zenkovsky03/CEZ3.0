import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './CourseCard.scss';

const safeFormatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const CourseCard = ({ course }) => {
    const { t } = useTranslation();

    const ownerName = course.owner
        ? `${course.owner.firstName} ${course.owner.lastName}`
        : t('common.no_info');

    const participantsCount = Number.isFinite(course.participantsCount)
        ? course.participantsCount
        : 0;

    const getCourseStatus = () => {
        const now = new Date();
        const start = new Date(course.startDate);
        const end = new Date(course.endDate);
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;

        if (now < start) return { label: t('course.status_upcoming'), className: 'upcoming' };
        if (now > end) return { label: t('course.status_ended'), className: 'completed' };
        return { label: t('course.status_active'), className: 'active' };
    };

    const status = getCourseStatus();

    return (
        <Link to={`/courses/${course.id}/structure`} className="course-card">
            <div className="card-header">
                <div className="course-title-section">
                    <h3 className="course-title">{course.name}</h3>
                    {course.isPasswordProtected && (
                        <span className="lock-icon" title={t('course.course_with_password')}>
                            🔒
                        </span>
                    )}
                </div>
                {status && (
                    <span className={`status-badge ${status.className}`}>
                        {status.label}
                    </span>
                )}
            </div>

            <p className="course-description">{course.description}</p>

            <div className="card-footer">
                <div className="course-info-item">
                    <span className="info-icon">👤</span>
                    <span className="info-text">{ownerName}</span>
                </div>

                <div className="course-info-item">
                    <span className="info-icon">👥</span>
                    <span className="info-text">
                        {participantsCount} {participantsCount === 1 ? t('course.participant') : t('course.participants')}
                    </span>
                </div>

                <div className="course-dates">
                    <div className="date-item">
                        <span className="date-label">{t('course.start_date')}:</span>
                        <span className="date-value">{safeFormatDate(course.startDate)}</span>
                    </div>
                    <div className="date-item">
                        <span className="date-label">{t('course.end_date')}:</span>
                        <span className="date-value">{safeFormatDate(course.endDate)}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CourseCard;