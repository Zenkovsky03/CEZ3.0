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
            <h2 className="section-title">Informacje o kursie</h2>

            <div className="info-main-grid">
                <div className="info-primary">
                    <InfoItem
                        label="Prowadzący"
                        value={ownerName}
                    />
                    <InfoItem
                        label="Liczba uczestników"
                        value={participantsCount}
                    />
                </div>

                <div className="info-dates">
                    <InfoItem
                        label="Data rozpoczęcia"
                        value={startDate}
                    />
                    <InfoItem
                        label="Data zakończenia"
                        value={endDate}
                    />
                </div>

                <div className="info-meta">
                    <InfoItem classname="info-item-status" label="Status">
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
        </div>
    );
};

export default CourseInfo;