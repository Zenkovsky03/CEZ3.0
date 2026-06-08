import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './CourseStructureHeader.scss';
import BackLink from "../../BackLink";

const CourseStructureHeader = ({ courseName, courseId, onAddModule }) => {
    const { t } = useTranslation();

    return (
        <div className="course-structure-header">
            <BackLink to="/courses">
                {t('course.back_to_courses')}
            </BackLink>
            <div className="header-content">
                <div className="header-text">
                    <h1>{t('course.structure')}</h1>
                    {courseName && (
                        <p className="course-name">{courseName}</p>
                    )}
                </div>
                <div className="header-actions">

                    <Link to={`/courses/${courseId}`} className="back-to-details-btn">
                        {t('course.details')}
                    </Link>
                    {onAddModule && (
                        <button
                            onClick={onAddModule}
                            className="add-module-btn"
                        >
                            <span className="btn-icon">+</span>
                            {t('course.module_add')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseStructureHeader;