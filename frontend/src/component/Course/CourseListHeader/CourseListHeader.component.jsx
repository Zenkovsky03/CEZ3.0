import React from 'react';
import './CourseListHeader.scss';

const CourseListHeader = ({ onCreateCourse, totalCourses }) => {
    return (
        <div className="course-list-header">
            <div className="header-content">
                <div className="header-text">
                    <h1>Kursy</h1>
                    <p className="subtitle">
                        {totalCourses === 0
                            ? 'Brak dostępnych kursów'
                            : `Dostępne kursy: ${totalCourses}`}
                    </p>
                </div>
                {onCreateCourse && (
                    <button
                        onClick={onCreateCourse}
                        className="create-button"
                    >
                        <span className="button-icon">+</span>
                        Utwórz kurs
                    </button>
                )}
            </div>
        </div>
    );
};

export default CourseListHeader;