import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../Header';
import Spinner from '../../Spinner';
import CourseStructureHeader from '../CourseStructureHeader';
import ModuleList from '../ModuleList';
import './CourseStructure.scss';

const CourseStructure = ({
                             course,
                             sections = [],
                             loading,
                             error,
                              onAddModule,
                              onEditModule,
                              onDeleteModule,
                              onRefresh,
                              canModify
                          }) => {
    const { t } = useTranslation();
    if (loading) {
        return (
            <div className="page-wrapper-course-structure">
                <Header variant="dashboard" />
                <div className="loading-container">
                    <Spinner size="lg" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-wrapper-course-structure">
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
        <div className="page-wrapper-course-structure">
            <Header variant="dashboard" />
            <div className="main-content">
                <CourseStructureHeader
                    courseName={course?.name}
                    courseId={course?.id}
                    onAddModule={onAddModule}
                />

                {sections.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-content">
                            <h3>{t('course.no_modules')}</h3>
                            <p>{t('course.no_modules_desc')}</p>
                            {onAddModule && (
                                <button onClick={onAddModule} className="add-module-button">
                                    {t('course.module_add_first')}
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <ModuleList
                        sections={sections}
                        courseId={course?.id}
                        onEditModule={onEditModule}
                        onDeleteModule={onDeleteModule}
                        onRefresh={onRefresh}
                        canModify={canModify}
                    />
                )}
            </div>
        </div>
    );
};

export default CourseStructure;