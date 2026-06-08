import React, { useContext, useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../Header';
import Spinner from '../Spinner';
import AuthContext from '../../context/AuthContext';
import { getCourses } from '../../services/courseService';
import { getCourseGrades } from '../../services/gradeService';
import './Grades.scss';

const formatDate = (iso) => {
    if (!iso) return '-';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '-';
    return new Intl.DateTimeFormat(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
};

const initialState = { loading: false, gradeData: [], error: '' };

const gradeReducer = (prev, action) => {
    switch (action.type) {
        case 'FETCH_START': return { ...prev, loading: true, error: '', gradeData: [] };
        case 'FETCH_SUCCESS': return { loading: false, error: '', gradeData: action.data };
        case 'FETCH_ERROR': return { ...prev, loading: false, error: action.error };
        default: return prev;
    }
};

const TeacherGrades = () => {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const [courses, setCourses] = React.useState([]);
    const [selectedCourse, setSelectedCourse] = React.useState('');
    const [{ loading, gradeData, error }, dispatch] = useReducer(gradeReducer, initialState);

    useEffect(() => {
        getCourses()
            .then(data => {
                const list = Array.isArray(data) ? data : data?.items || data?.courses || [];
                setCourses(Array.isArray(list) ? list : []);
            })
            .catch(() => setCourses([]));
    }, []);

    useEffect(() => {
        if (!selectedCourse) { return; }
        dispatch({ type: 'FETCH_START' });

        getCourseGrades(selectedCourse)
            .then(data => {
                const list = Array.isArray(data) ? data : [];
                dispatch({ type: 'FETCH_SUCCESS', data: list });
            })
            .catch(err => {
                dispatch({ type: 'FETCH_ERROR', error: err.message || t('error.load_grades') });
            });
    }, [selectedCourse, t]);

    if (!user || (user.role !== 'Teacher' && user.role !== 'Admin')) {
        return (
            <div className="page-wrapper-grades">
                <Header variant="dashboard" />
                <div className="main-content"><p>{t('common.no_permissions')}</p></div>
            </div>
        );
    }

    return (
        <div className="page-wrapper-grades">
            <Header variant="dashboard" />
            <div className="main-content">
                <div className="page-header">
                    <div className="page-header-text">
                        <h1 className="page-title">{t('grade.course_grades')}</h1>
                        <p className="page-subtitle">{t('grade.course_grades_subtitle')}</p>
                    </div>
                </div>

                <div className="form-group" style={{ maxWidth: '400px', marginBottom: '2rem' }}>
                    <label htmlFor="course-select" className="form-label">{t('grade.select_course')}</label>
                    <select
                        id="course-select"
                        className="form-input"
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                    >
                        <option value="">{t('grade.select_course_placeholder')}</option>
                        {courses.map(c => (
                            <option key={c.id} value={c.id}>{c.name || c.title}</option>
                        ))}
                    </select>
                </div>

                {error && <div className="error-message">{error}</div>}

                {loading && <Spinner />}

                {!loading && selectedCourse && gradeData.length === 0 && (
                    <div className="empty-state">
                        <span className="material-symbols-outlined">grade</span>
                        <p>{t('grade.no_grades_in_course')}</p>
                    </div>
                )}

                {gradeData.map(student => (
                    <div key={student.studentId} className="grade-section">
                        <div className="grade-section-header">
                            <div className="student-avatar">
                                {(student.studentFirstName?.[0] || '?').toUpperCase()}
                            </div>
                            <div>
                                <h3>{[student.studentFirstName, student.studentLastName].filter(Boolean).join(' ') || t('common.unknown')}</h3>
                                <span className="student-email">{student.studentEmail}</span>
                            </div>
                        </div>
                        {(student.grades || []).length === 0 ? (
                            <p className="no-grades">{t('grade.no_grades_student')}</p>
                        ) : (
                            <table className="grades-table">
                                <thead>
                                    <tr>
                                        <th>{t('grade.assignment')}</th>
                                        <th>{t('grade.score')}</th>
                                        <th>{t('grade.mark')}</th>
                                        <th>{t('grade.date')}</th>
                                        <th>{t('grade.comment')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {student.grades.map(g => (
                                        <tr key={g.gradeId}>
                                            <td>{g.assignmentTitle}</td>
                                            <td>{g.pointsRecieved} / {g.maxPoints}</td>
                                            <td><span className={`grade-badge grade-${(g.mark || '')[0]?.toLowerCase() || 'none'}`}>{g.mark || '-'}</span></td>
                                            <td>{formatDate(g.createdAt)}</td>
                                            <td className="feedback-cell">{g.feedback || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeacherGrades;
