import React from 'react';
import Header from '../../Header';
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
    if (loading) {
        return (
            <div className="page-wrapper-course-list">
                <Header variant="dashboard" />
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Ładowanie kursów...</p>
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
                        Spróbuj ponownie
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