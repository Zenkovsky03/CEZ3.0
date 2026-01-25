import React from 'react';
import { Link } from 'react-router-dom';
import './CourseStructureHeader.scss';
import BackLink from "../../BackLink";

const CourseStructureHeader = ({ courseName, courseId, onAddModule }) => {
    return (
        <div className="course-structure-header">
            <BackLink to="/courses">
                Powrót do listy kursów
            </BackLink>
            <div className="header-content">
                <div className="header-text">
                    <h1>Struktura kursu</h1>
                    {courseName && (
                        <p className="course-name">{courseName}</p>
                    )}
                </div>
                <div className="header-actions">

                    <Link to={`/courses/${courseId}`} className="back-to-details-btn">
                        Szczegóły kursu
                    </Link>
                    {onAddModule && (
                        <button
                            onClick={onAddModule}
                            className="add-module-btn"
                        >
                            <span className="btn-icon">+</span>
                            Dodaj moduł
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseStructureHeader;