import React from 'react';
import '../../AdminCoursesPage.scss';

const CoursesHeader = ({ onImportClick, onExportClick, onAddCourseClick }) => {
    return (
        <div className="admin-courses__header">
            <div>
                <h1>Kursy</h1>
                <p>Zarządzaj i monitoruj kursy na platformie edukacyjnej</p>
            </div>
            <div className="admin-courses__header-actions">
                <button className="admin-courses__btn admin-courses__btn--secondary" type="button" onClick={onImportClick}>
                    <span className="material-symbols-outlined">upload</span>
                    <span>Importuj</span>
                </button>
                <button className="admin-courses__btn admin-courses__btn--secondary" type="button" onClick={onExportClick}>
                    <span className="material-symbols-outlined">download</span>
                    <span>Eksportuj</span>
                </button>
                <button className="admin-courses__btn admin-courses__btn--primary" type="button" onClick={onAddCourseClick}>
                    <span className="material-symbols-outlined">add</span>
                    <span>Dodaj kurs</span>
                </button>
            </div>
        </div>
    );
};

export default CoursesHeader;
