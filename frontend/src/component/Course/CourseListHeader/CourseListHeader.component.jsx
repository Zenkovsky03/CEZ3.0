import React from 'react';
import { useTranslation } from 'react-i18next';
import './CourseListHeader.scss';

const CourseListHeader = ({ onCreateCourse, totalCourses }) => {
    const { t } = useTranslation();
    return (
        <div className="course-list-header">
            <div className="header-content">
                <div className="header-text">
                    <h1>{t('course.title')}</h1>
                    <p className="subtitle">
                        {totalCourses === 0
                            ? t('course.no_courses')
                            : `${t('course.available_courses')}: ${totalCourses}`}
                    </p>
                </div>
                {onCreateCourse && (
                    <button
                        onClick={onCreateCourse}
                        className="create-button"
                    >
                        <span className="button-icon">+</span>
                        {t('course.create')}
                    </button>
                )}
            </div>
        </div>
    );
};

export default CourseListHeader;