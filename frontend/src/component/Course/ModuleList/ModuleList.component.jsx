import React from 'react';
import ModuleCard from '../ModuleCard';
import './ModuleList.scss';

const ModuleList = ({ sections = [], onEditModule, onDeleteModule }) => {
    return (
        <div className="module-list">
            {sections.map((section) => (
                <ModuleCard
                    key={section.id}
                    section={section}
                    onEdit={onEditModule}
                    onDelete={onDeleteModule}
                />
            ))}
        </div>
    );
};

export default ModuleList;