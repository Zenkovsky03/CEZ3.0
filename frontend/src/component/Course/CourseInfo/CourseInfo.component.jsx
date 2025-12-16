import React from 'react';
import InfoItem from '../../InfoItem';
import StatusBadge from '../../StatusBadge';

const CourseInfo = ({
                        startDate,
                        endDate,
                        ownerName,
                        participantsCount,
                        status,
                        isPasswordProtected
                    }) => {
    return (
        <div className="course-info">
            <h2 className="section-title">📚 Informacje o kursie</h2>

            <div className="info-grid">
                <InfoItem
                    label="Data rozpoczęcia"
                    value={startDate}
                />

                <InfoItem
                    label="Data zakończenia"
                    value={endDate}
                />

                <InfoItem
                    label="Prowadzący"
                    value={ownerName}
                />

                <InfoItem
                    label="Liczba uczestników"
                    value={participantsCount}
                />

                <InfoItem label="Status">
                    <StatusBadge status={status.status} text={status.text} />
                </InfoItem>

                {isPasswordProtected && (
                    <InfoItem
                        label="Zabezpieczenie"
                        value="🔒 Chroniony hasłem"
                    />
                )}
            </div>
        </div>
    );
};

export default CourseInfo;