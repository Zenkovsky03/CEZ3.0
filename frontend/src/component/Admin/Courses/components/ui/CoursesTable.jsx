import React from 'react';
import '../../AdminCoursesPage.scss';

const formatDate = (value) => {
    const date = new Date(value);
    return date.toLocaleDateString('pl-PL');
};

const formatParticipantLabel = (participants) => `${participants ?? 0} uczestników`;

const statusClassMap = {
    Aktywny: 'admin-courses__status admin-courses__status--active',
    'W trakcie': 'admin-courses__status admin-courses__status--progress',
    Planowany: 'admin-courses__status admin-courses__status--planned',
    Archiwalny: 'admin-courses__status admin-courses__status--archived'
};

const CoursesTable = ({ courses, loading, onEditCourse, onDeleteCourse }) => {
    if (loading) {
        return (
            <div className="admin-courses__table-card">
                <div style={{ padding: '1.5rem', color: '#6b7280', fontWeight: 600 }}>
                    Ładowanie kursów...
                </div>
            </div>
        );
    }

    return (
        <div className="admin-courses__table-card">
            <table className="admin-courses__table">
                <thead>
                    <tr>
                        <th>Nazwa kursu</th>
                        <th>Instruktor</th>
                        <th>Uczestnicy</th>
                        <th>Postęp</th>
                        <th>Termin</th>
                        <th>Status</th>
                        <th>Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {!courses.length && (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center', color: '#6b7280', padding: '1.5rem' }}>
                                Brak kursów do wyświetlenia.
                            </td>
                        </tr>
                    )}
                    {courses.map((course) => (
                        <tr key={course.id}>
                            <td>
                                <div className="admin-courses__course-name">{course.name}</div>
                                <div className="admin-courses__course-desc">{course.description}</div>
                            </td>
                            <td>
                                <div className="admin-courses__instructor">
                                    <div className="admin-courses__instructor-avatar">{course.instructorInitials}</div>
                                    <span>{course.instructor}</span>
                                </div>
                            </td>
                            <td>
                                <span className="admin-courses__participants-current">{formatParticipantLabel(course.participants)}</span>
                            </td>
                            <td>
                                <div className="admin-courses__progress-bar">
                                    <div className="admin-courses__progress-fill" style={{ width: `${course.progress}%` }} />
                                </div>
                                <div className="admin-courses__progress-value">
                                    {course.progress === 0 ? 'Nie rozpoczęto' : `${course.progress}% ukończono`}
                                </div>
                            </td>
                            <td>
                                <div className="admin-courses__term">{formatDate(course.startDate)}</div>
                                <div className="admin-courses__term-separator">↓</div>
                                <div className="admin-courses__term">{formatDate(course.endDate)}</div>
                            </td>
                            <td>
                                <span className={statusClassMap[course.status] || 'admin-courses__status'}>
                                    {course.status}
                                </span>
                            </td>
                            <td className="admin-courses__actions-cell">
                                <button
                                    className="admin-courses__actions-btn"
                                    type="button"
                                    aria-label="Edytuj kurs"
                                    onClick={() => onEditCourse?.(course.id)}
                                >
                                    <span className="material-symbols-outlined">edit</span>
                                </button>
                                <button
                                    className="admin-courses__actions-btn"
                                    type="button"
                                    aria-label="Usuń kurs"
                                    onClick={() => onDeleteCourse?.(course.id)}
                                >
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                                <button className="admin-courses__actions-btn" type="button" aria-label="Więcej akcji">
                                    <span className="material-symbols-outlined">more_vert</span>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CoursesTable;
