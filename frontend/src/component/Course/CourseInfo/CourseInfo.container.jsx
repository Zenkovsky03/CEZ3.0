import React from 'react';
import { useTranslation } from 'react-i18next';
import CourseInfo from './CourseInfo.component';
import './CourseInfo.scss';

const safeFormatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const CourseInfoContainer = ({ course, participantsCount }) => {
    const { t } = useTranslation();

    if (!course) return null;

    const getCourseStatus = () => {
        const now = new Date();
        const start = new Date(course.startDate);
        const end = new Date(course.endDate);
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;

        if (now < start) return { status: 'upcoming', text: t('course.status_upcoming') };
        if (now > end) return { status: 'ended', text: t('course.status_ended') };
        return { status: 'active', text: t('course.status_active') };
    };

    const getOwnerName = () => {
        return course.owner
            ? `${course.owner.firstName} ${course.owner.lastName}`
            : t('common.no_info');
    };

    const startDate = safeFormatDate(course.startDate);
    const endDate = safeFormatDate(course.endDate);
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