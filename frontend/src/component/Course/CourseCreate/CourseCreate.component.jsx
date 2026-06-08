import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import CourseForm from '../CourseForm/index.jsx';

const CourseCreate = ({ isEditMode = false }) => {
    const { t } = useTranslation();
    return (
        <div className="page-wrapper-course">
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
                                ← {t('course.back_to_courses')}
                            </Link>
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CourseCreate;