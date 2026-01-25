import React from 'react';
import SearchBar from "../../SearchBar/SearchBar.component.jsx";
import './CourseListFilters.scss';

const CourseListFilters = ({
                               filters = { searchTerm: '', sortBy: 'name', filterByStatus: 'all' },
                               onFilterChange = () => {}
                           }) => {
    const handleSearchChange = (value) => {
        onFilterChange({ searchTerm: value });
    };

    const handleSortChange = (e) => {
        onFilterChange({ sortBy: e.target.value });
    };

    const handleStatusChange = (e) => {
        onFilterChange({ filterByStatus: e.target.value });
    };

    return (
        <div className="course-list-filters">
            <SearchBar
                value={filters.searchTerm}
                onChange={handleSearchChange}
                placeholder="Szukaj kursów..."
            />

            <div className="filter-controls">
                <div className="filter-group">
                    <label htmlFor="status-filter">Status:</label>
                    <select
                        id="status-filter"
                        value={filters.filterByStatus}
                        onChange={handleStatusChange}
                        className="filter-select"
                    >
                        <option value="all">Wszystkie</option>
                        <option value="active">Aktywne</option>
                        <option value="upcoming">Nadchodzące</option>
                        <option value="completed">Zakończone</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="sort-filter">Sortuj:</label>
                    <select
                        id="sort-filter"
                        value={filters.sortBy}
                        onChange={handleSortChange}
                        className="filter-select"
                    >
                        <option value="name">Nazwa</option>
                        <option value="startDate">Data rozpoczęcia</option>
                        <option value="participants">Liczba uczestników</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default CourseListFilters;