import React from 'react';
import CourseInfo from './CourseInfo.component';
import './CourseInfo.scss';

const CourseInfoContainer = ({ course, participantsCount }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getCourseStatus = () => {
        const now = new Date();
        const start = new Date(course.startDate);
        const end = new Date(course.endDate);

        if (now < start) return { status: 'upcoming', text: 'Nadchodzący' };
        if (now > end) return { status: 'ended', text: 'Zakończony' };
        return { status: 'active', text: 'W trakcie' };
    };

    const getOwnerName = () => {
        return course.owner
            ? `${course.owner.firstName} ${course.owner.lastName}`
            : 'Brak informacji';
    };

    const startDate = formatDate(course.startDate);
    const endDate = formatDate(course.endDate);
    const ownerName = getOwnerName();
    const status = getCourseStatus();

    return (
        <CourseInfo
            startDate={startDate}
            endDate={endDate}
            ownerName={ownerName}
            participantsCount={participantsCount}
            status={status}
            isPasswordProtected={course.isPasswordProtected}
        />
    );
};

export default CourseInfoContainer;