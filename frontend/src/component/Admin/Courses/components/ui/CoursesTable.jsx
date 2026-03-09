import React from 'react';
import '../../AdminCoursesPage.scss';

const formatDate = (value) => {
    const date = new Date(value);
    return date.toLocaleDateString('pl-PL');
};

const statusClassMap = {
    Aktywny: 'admin-courses__status admin-courses__status--active',
    'W trakcie': 'admin-courses__status admin-courses__status--progress',
    Planowany: 'admin-courses__status admin-courses__status--planned',
    Archiwalny: 'admin-courses__status admin-courses__status--archived'
};

const CoursesTable = ({ courses }) => {
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
                                <span className="admin-courses__participants-current">{course.participants}</span>
                                <span className="admin-courses__participants-limit"> / {course.maxParticipants}</span>
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
