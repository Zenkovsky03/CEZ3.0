import React from 'react';
import '../../AdminCoursesPage.scss';

const CoursesHeader = () => {
    return (
        <div className="admin-courses__header">
            <div>
                <h1>Kursy</h1>
                <p>Zarządzaj i monitoruj kursy na platformie edukacyjnej</p>
            </div>
            <div className="admin-courses__header-actions">
                <button className="admin-courses__btn admin-courses__btn--secondary" type="button">
                    <span className="material-symbols-outlined">upload</span>
                    <span>Importuj</span>
                </button>
                <button className="admin-courses__btn admin-courses__btn--primary" type="button">
                    <span className="material-symbols-outlined">add</span>
                    <span>Dodaj kurs</span>
                </button>
            </div>
        </div>
    );
};

export default CoursesHeader;
