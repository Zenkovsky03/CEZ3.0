import React from 'react';
import { useTranslation } from 'react-i18next';
import InfoItem from '../../InfoItem';
import StatusBadge from '../../StatusBadge';

const CourseInfo = ({ startDate, endDate, ownerName, participantsCount, status, isPasswordProtected }) => {
    const { t } = useTranslation();

    return (
        <div className="course-info">
            <h2 className="section-title">{t('course.info')}</h2>

            <div className="info-main-grid">
                <div className="info-primary">
                    <InfoItem
                        label={t('course.instructor')}
                        value={ownerName}
                    />
                    <InfoItem
                        label={t('course.participants_count')}
                        value={participantsCount}
                    />
                </div>

                <div className="info-dates">
                    <InfoItem
                        label={t('course.start_date')}
                        value={startDate}
                    />
                    <InfoItem
                        label={t('course.end_date')}
                        value={endDate}
                    />
                </div>

                <div className="info-meta">
                    {status && (
                        <InfoItem classname="info-item-status" label={t('course.status')}>
                            <StatusBadge status={status.status} text={status.text} />
                        </InfoItem>
                    )}

                    {isPasswordProtected && (
                        <InfoItem
                            label={t('course.protection')}
                            value={t('course.course_with_password')}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseInfo;