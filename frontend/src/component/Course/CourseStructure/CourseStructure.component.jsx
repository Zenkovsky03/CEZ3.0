// CourseStructure/CourseStructure.component.jsx
import React from 'react';
import CourseStructureHeader from '../CourseStructureHeader';
import ModuleList from '../ModuleList';
import './CourseStructure.scss';

const CourseStructure = ({
                             course,
                             sections = [],
                             loading,
                             error,
                             onAddModule,
                             onEditModule,
                             onDeleteModule
                         }) => {
    if (loading) {
        return (
            <div className="page-wrapper-course-structure">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Ładowanie struktury kursu...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-wrapper-course-structure">
                <div className="error-container">
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()} className="retry-button">
                        Spróbuj ponownie
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper-course-structure">
            <div className="main-content">
                <CourseStructureHeader
                    courseName={course?.name}
                    courseId={course?.id}
                    onAddModule={onAddModule}
                />

                {sections.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-content">
                            <h3>Brak modułów</h3>
                            <p>Ten kurs nie ma jeszcze żadnych modułów. Dodaj pierwszy moduł, aby rozpocząć.</p>
                            {onAddModule && (
                                <button onClick={onAddModule} className="add-module-button">
                                    Dodaj pierwszy moduł
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <ModuleList
                        sections={sections}
                        onEditModule={onEditModule}
                        onDeleteModule={onDeleteModule}
                    />
                )}
            </div>
        </div>
    );
};

export default CourseStructure;