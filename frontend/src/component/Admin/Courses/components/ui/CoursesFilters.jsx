import React from 'react';
import '../../AdminCoursesPage.scss';

const CoursesFilters = ({ query, onQueryChange, onClearFilters }) => {
    return (
        <div className="admin-courses__filters">
            <div className="admin-courses__search-wrapper">
                <span className="material-symbols-outlined">search</span>
                <input
                    type="text"
                    placeholder="Szukaj kursu, prowadzącego, tagu..."
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                />
            </div>

            <div className="admin-courses__filters-actions">
                <select className="admin-courses__filter-select" defaultValue="Status">
                    <option>Status</option>
                    <option>Aktywny</option>
                    <option>W trakcie</option>
                    <option>Planowany</option>
                    <option>Archiwalny</option>
                </select>
                <select className="admin-courses__filter-select" defaultValue="Kategoria">
                    <option>Kategoria</option>
                    <option>IT</option>
                    <option>Biznes</option>
                </select>
                <button className="admin-courses__date-btn" type="button">
                    <span className="material-symbols-outlined">calendar_today</span>
                    <span>Zakres dat</span>
                </button>
                <button className="admin-courses__clear-btn" type="button" onClick={onClearFilters}>
                    Wyczyść filtry
                </button>
            </div>
        </div>
    );
};

export default CoursesFilters;
