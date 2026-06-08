import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import LessonItem from '../LessonItem';
import Spinner from '../../Spinner';
import { createLesson, deleteLesson } from '../../../services/sectionMaterialService';
import './ModuleCard.scss';

const ModuleCard = ({ section, courseId, onEdit, onDelete, onRefresh, canModify }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(true);
    const [showAddLesson, setShowAddLesson] = useState(false);
    const [lessonTitle, setLessonTitle] = useState('');
    const [lessonContent, setLessonContent] = useState('');
    const [lessonSaving, setLessonSaving] = useState(false);

    const materials = section.materials || [];
    const assignments = section.assignments || [];
    const totalItems = materials.length + assignments.length;

    const allItems = [
        ...materials.map(m => ({ ...m, itemType: 'material' })),
        ...assignments.map(a => ({ ...a, itemType: 'assignment' }))
    ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleAddLesson = async (e) => {
        e.preventDefault();
        if (!lessonTitle.trim() || lessonSaving) return;
        setLessonSaving(true);
        try {
            await createLesson({
                title: lessonTitle.trim(),
                content: lessonContent.trim(),
                sectionId: section.id,
                materialType: 'Lesson'
            });
            setLessonTitle('');
            setLessonContent('');
            setShowAddLesson(false);
            onRefresh?.();
        } catch (err) {
            alert(err.message || t('error.create_lesson'));
        } finally {
            setLessonSaving(false);
        }
    };

    const handleDeleteLesson = async (lessonId) => {
        if (!window.confirm(t('course.lesson_delete_confirm'))) return;
        try {
            await deleteLesson(lessonId);
            onRefresh?.();
        } catch (err) {
            alert(err.message || t('error.delete_lesson'));
        }
    };

    const handleAddAssignment = () => {
        navigate(`/assignments/create?courseId=${courseId}&sectionId=${section.id}`);
    };

    const handleItemClick = (item) => {
        if (item.itemType === 'material') {
            navigate(`/courses/${courseId}/lessons/${item.id}`);
        } else {
            navigate('/assignments');
        }
    };

    return (
        <div className={`module-card ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <div className="module-header" onClick={toggleExpand}>
                <div className="module-header-left">
                    <button className="expand-btn" aria-label={isExpanded ? t('common.collapse') : t('common.expand')}>
                        <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
                            ▶
                        </span>
                    </button>
                    <div className="module-info">
                        <h3 className="module-title">{section.title}</h3>
                        <p className="module-meta">
                            {totalItems === 0 ? t('course.no_items') :
                                t('course.items_count', { count: totalItems })}
                        </p>
                    </div>
                </div>
                <div className="module-header-right" onClick={(e) => e.stopPropagation()}>
                    <span className="module-order">{t('course.module', { index: section.orderIndex })}</span>
                    <button
                        className="icon-btn edit-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.(section.id);
                        }}
                        title={t('course.module_edit')}
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.3879 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L5.33301 13.3334L1.33301 14.6667L2.66634 10.6667L11.333 2.00004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <button
                        className="icon-btn delete-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(section.id);
                        }}
                        title={t('course.module_delete')}
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 4H3.33333H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5.33301 4.00004V2.66671C5.33301 2.31309 5.47348 1.97395 5.72353 1.7239C5.97358 1.47385 6.31272 1.33337 6.66634 1.33337H9.33301C9.68663 1.33337 10.0258 1.47385 10.2758 1.7239C10.5259 1.97395 10.6663 2.31309 10.6663 2.66671V4.00004M12.6663 4.00004V13.3334C12.6663 13.687 12.5259 14.0261 12.2758 14.2762C12.0258 14.5262 11.6866 14.6667 11.333 14.6667H4.66634C4.31272 14.6667 3.97358 14.5262 3.72353 14.2762C3.47348 14.0261 3.33301 13.687 3.33301 13.3334V4.00004H12.6663Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="module-content">
                    {totalItems === 0 && !showAddLesson ? (
                        <div className="empty-module">
                            <p>{t('course.no_lessons')}</p>
                        </div>
                    ) : (
                        <div className="lessons-list">
                            {allItems.map((item, index) => (
                                <LessonItem
                                    key={`${item.itemType}-${item.id}`}
                                    item={item}
                                    index={index + 1}
                                    canModify={canModify}
                                    onDelete={item.itemType === 'material' ? handleDeleteLesson : undefined}
                                    onClick={handleItemClick}
                                />
                            ))}
                        </div>
                    )}

                    {showAddLesson && (
                        <form className="add-lesson-form" onSubmit={handleAddLesson}>
                            <input
                                type="text"
                                className="form-input"
                                placeholder={t('course.lesson_title_placeholder')}
                                value={lessonTitle}
                                onChange={(e) => setLessonTitle(e.target.value)}
                                required
                                autoFocus
                            />
                            <textarea
                                className="form-textarea"
                                placeholder={t('course.lesson_content_placeholder')}
                                value={lessonContent}
                                onChange={(e) => setLessonContent(e.target.value)}
                                rows={3}
                            />
                            <div className="add-lesson-actions">
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() => { setShowAddLesson(false); setLessonTitle(''); setLessonContent(''); }}
                                >
                                    {t('common.cancel')}
                                </button>
                                <button type="submit" className="btn-primary btn-sm" disabled={!lessonTitle.trim() || lessonSaving}>
                                    {lessonSaving ? <Spinner size="sm" /> : t('course.lesson_add')}
                                </button>
                            </div>
                        </form>
                    )}

                    {canModify && (
                        <div className="module-actions">
                            {!showAddLesson && (
                                <button className="btn-module-action" onClick={() => setShowAddLesson(true)}>
                                    <span className="material-symbols-outlined">add</span>
                                    {t('course.lesson_add')}
                                </button>
                            )}
                            <button className="btn-module-action" onClick={handleAddAssignment}>
                                <span className="material-symbols-outlined">add</span>
                                {t('course.assignment_add')}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ModuleCard;