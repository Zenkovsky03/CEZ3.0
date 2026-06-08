import React from 'react';
import ModuleCard from '../ModuleCard';
import './ModuleList.scss';

const ModuleList = ({ sections = [], courseId, onEditModule, onDeleteModule, onRefresh, canModify }) => {
    return (
        <div className="module-list">
            {sections.map((section) => (
                <ModuleCard
                    key={section.id}
                    section={section}
                    courseId={courseId}
                    onEdit={onEditModule}
                    onDelete={onDeleteModule}
                    onRefresh={onRefresh}
                    canModify={canModify}
                />
            ))}
        </div>
    );
};

export default ModuleList;