import React from 'react';
import BackLink from "../../BackLink/index.jsx";

const CourseHeader = ({ name, description , id }) => {
    return (
        <div className="course-header">
            <BackLink to={`/courses/${id}/structure`} >
                Powrót do kursu
            </BackLink>
            <h1 className="course-title">{name}</h1>
            <p className="course-description">{description}</p>
        </div>
    );
};

export default CourseHeader;