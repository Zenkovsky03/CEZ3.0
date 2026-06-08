import React from 'react';
import { useTranslation } from 'react-i18next';
import SearchBar from "../../SearchBar/SearchBar.component.jsx";
import './CourseListFilters.scss';

const CourseListFilters = ({
                               filters = { searchTerm: '', sortBy: 'name', filterByStatus: 'all' },
                               onFilterChange = () => {}
                           }) => {
    const { t } = useTranslation();

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
                placeholder={t('course.search_placeholder')}
            />

            <div className="filter-controls">
                <div className="filter-group">
                    <label htmlFor="status-filter">{t('Status:')}</label>
                    <select
                        id="status-filter"
                        value={filters.filterByStatus}
                        onChange={handleStatusChange}
                        className="filter-select"
                    >
                        <option value="all">{t('common.all')}</option>
                        <option value="active">{t('Aktywne')}</option>
                        <option value="upcoming">{t('Nadchodzące')}</option>
                        <option value="completed">{t('Zakończone')}</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="sort-filter">{t('Sortuj:')}</label>
                    <select
                        id="sort-filter"
                        value={filters.sortBy}
                        onChange={handleSortChange}
                        className="filter-select"
                    >
                        <option value="name">{t('Nazwa')}</option>
                        <option value="startDate">{t('Data rozpoczęcia')}</option>
                        <option value="participants">{t('Liczba uczestników')}</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default CourseListFilters;