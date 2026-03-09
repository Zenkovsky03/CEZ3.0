import React from 'react';

function TopCoursesCard({ courses }) {
    return (
        <section className="admin-dashboard__panel">
            <h2>Najpopularniejsze kursy</h2>
            <p className="admin-dashboard__sub">Top 5 według zapisów</p>
            <ul className="admin-dashboard__top-list">
                {courses.map((course) => (
                    <li key={course.name} className="admin-dashboard__top-item">
                        <div className="admin-dashboard__top-row">
                            <span>{course.name}</span>
                            <strong>{course.score}</strong>
                        </div>
                        <div className="admin-dashboard__top-track" aria-hidden="true">
                            <div className="admin-dashboard__top-fill" style={{ width: `${course.progress}%` }} />
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default TopCoursesCard;
