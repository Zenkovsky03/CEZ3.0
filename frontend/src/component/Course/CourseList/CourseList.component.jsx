import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../Header';
import Spinner from '../../Spinner';
import CourseListHeader from '../CourseListHeader';
import CourseCard from '../CourseCard';
import CourseListFilters from '../CourseListFilters';

const CourseList = ({
                        courses = [],
                        loading,
                        error,
                        filters,
                        onFilterChange,
                        onCreateCourse
                    }) => {
    const { t } = useTranslation();
    if (loading) {
        return (
            <div className="page-wrapper-course-list">
                <Header variant="dashboard" />
                <div className="loading-container">
                    <Spinner size="lg" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-wrapper-course-list">
                <Header variant="dashboard" />
                <div className="error-container">
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()} className="retry-button">
                        {t('common.retry')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper-course-list">
            <Header variant="dashboard" />
            <div className="main-content">
                <CourseListHeader
                    onCreateCourse={onCreateCourse}
                    totalCourses={courses.length}
                />

                <CourseListFilters
                    filters={filters}
                    onFilterChange={onFilterChange}
                />

                <div className="courses-grid">
                    {courses.map(course => (
                        <CourseCard
                            key={course.id}
                            course={course}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CourseList;