import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import AuthContext from '../../../context/AuthContext';
import Header from '../../Header';
import Spinner from '../../Spinner';
import CourseHeader from '../CourseHeader';
import CourseInfo from '../CourseInfo';
import ParticipantsList from '../ParticipantsList';

const formatDate = (iso) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
};

const GRADE_COLORS = {
    A: '#16a34a', B: '#2563eb', C: '#ca8a04',
    D: '#f97316', E: '#dc2626', F: '#dc2626'
};

const CourseDetails = ({
                           course,
                           participants,
                           grades,
                           loading,
                           error,
                           onRemoveParticipant,
                           onAddParticipant
                       }) => {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="page-wrapper-course-details">
                <Header variant="dashboard" />
                <div className="loading-container">
                    <Spinner size="lg" />
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="page-wrapper-course-details">
                <Header variant="dashboard" />
                <div className="error-container">
                    <p>{error || t('course.not_found')}</p>
                    <Link to="/courses" className="link">{t('course.back_to_courses')}</Link>
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
                                {t('course.edit')}
                            </Link>
                        )}
                    </div>

                    <div className="course-info-section">
                        <CourseInfo
                            course={course}
                            participantsCount={(participants || []).length}
                        />
                    </div>

                    <div className="participants-section">
                        <ParticipantsList
                            participants={participants}
                            onRemove={onRemoveParticipant}
                            onAdd={onAddParticipant}
                            userRole={user?.role}
                        />
                    </div>

                    {user?.role === 'Student' && (grades || []).length > 0 && (
                        <div className="course-grades-section">
                            <h2 className="section-heading">{t('course.my_grades')}</h2>
                            <div className="course-grades-table">
                                <div className="grades-table-header">
                                    <span className="col-assignment">{t('course.assignment')}</span>
                                    <span className="col-score">{t('course.score')}</span>
                                    <span className="col-mark">{t('course.mark')}</span>
                                    <span className="col-date">{t('course.date')}</span>
                                </div>
                                {grades.map(g => (
                                    <div key={g.id} className="grades-row">
                                        <span className="col-assignment">{g.assignmentTitle}</span>
                                        <span className="col-score">{g.pointsRecieved}/{g.maxPoints}</span>
                                        <span className="col-mark">
                                            <span className="grade-badge-sm" style={{ background: GRADE_COLORS[g.mark] || '#6b7280' }}>
                                                {g.mark || '—'}
                                            </span>
                                        </span>
                                        <span className="col-date">{formatDate(g.createdAt)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;