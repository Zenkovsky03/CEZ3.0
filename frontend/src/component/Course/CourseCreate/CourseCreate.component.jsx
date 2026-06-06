import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../Header';
import CourseForm from '../CourseForm/index.jsx';

const CourseCreate = ({ isEditMode = false }) => {
    return (
        <div className="page-wrapper-course">
            <Header variant="dashboard" />
            <div className="page-container">
                <main className="main-content">
                    <div className="course-wrapper">
                        <div className="course-header-text">
                            <h1 className="course-title">
                                {isEditMode ? 'Edytuj kurs' : 'Utwórz nowy kurs'}
                            </h1>
                            <p className="course-subtitle">
                                {isEditMode
                                    ? 'Zaktualizuj informacje o swoim kursie.'
                                    : 'Wypełnij formularz, aby utworzyć nowy kurs.'}
                            </p>
                        </div>

                        <div className="course-card">
                            <CourseForm isEditMode={isEditMode} />
                        </div>

                        <p className="back-link-text">
                            <Link className="link" to="/courses">
                                ← Powrót do listy kursów
                            </Link>
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CourseCreate;