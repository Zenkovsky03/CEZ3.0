import React from 'react';
import { Link } from 'react-router-dom';

const CourseHeader = ({ name, description }) => {
    return (
        <div className="course-header">
            <Link to="/courses" className="back-link">
                ← Powrót do listy kursów
            </Link>
            <h1 className="course-title">{name}</h1>
            <p className="course-description">{description}</p>
        </div>
    );
};

export default CourseHeader;