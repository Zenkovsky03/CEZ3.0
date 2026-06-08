import React from 'react';
import { useTranslation } from 'react-i18next';
import BackLink from "../../BackLink/index.jsx";

const CourseHeader = ({ name, description , id }) => {
    const { t } = useTranslation();

    return (
        <div className="course-header">
            <BackLink to={`/courses/${id}/structure`} >
                {t('course.back_to_structure')}
            </BackLink>
            <h1 className="course-title">{name}</h1>
            <p className="course-description">{description}</p>
        </div>
    );
};

export default CourseHeader;