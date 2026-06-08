import React, { Fragment, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../../Header';
import Spinner from '../../Spinner';
import { getLessonById, getLessonAttachments, markLessonComplete } from '../../../services/sectionMaterialService';
import './LessonView.scss';

const renderBoldText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return <Fragment key={i}>{part}</Fragment>;
    });
};

const ATTACHMENT_TYPES = {
    Video: { bg: '#fee2e2', color: '#dc2626', icon: 'play_circle' },
    Pdf: { bg: '#fef3c7', color: '#d97706', icon: 'picture_as_pdf' },
    Image: { bg: '#dcfce7', color: '#16a34a', icon: 'image' },
    Link: { bg: '#e0f2fe', color: 'rgb(58 124 165)', icon: 'link' },
};

const getAttachmentStyle = (type) => {
    const key = type?.charAt(0).toUpperCase() + type?.slice(1).toLowerCase();
    return ATTACHMENT_TYPES[key] || ATTACHMENT_TYPES.Link;
};

const LessonView = () => {
    const { t } = useTranslation();
    const { cId, lId } = useParams();
    const [lesson, setLesson] = useState(null);
    const [attachments, setAttachments] = useState([]);
    const [completed, setCompleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            setLoading(true);
            try {
                const [lessonData, attachmentsData] = await Promise.allSettled([
                    getLessonById(lId),
                    getLessonAttachments(lId).catch(() => [])
                ]);

                if (!mounted) return;

                if (lessonData.status === 'fulfilled') {
                    setLesson(lessonData.value);
                } else {
                    setError(t('lesson.load_error'));
                }

                if (attachmentsData.status === 'fulfilled') {
                    const list = Array.isArray(attachmentsData.value) ? attachmentsData.value : [];
                    setAttachments(list);
                }
            } catch (err) {
                if (!mounted) return;
                setError(err.message || t('lesson.load_error'));
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();
        return () => { mounted = false; };
    }, [lId, t]);

    const handleComplete = async () => {
        try {
            if (lesson?.sectionId) {
                await markLessonComplete(lesson.sectionId);
            }
            setCompleted(true);
        } catch (err) {
            console.error('Failed to mark lesson complete:', err);
            setCompleted(true);
        }
    };

    if (loading) return (
        <div className="page-wrapper-lesson">
            <Header variant="dashboard" />
            <div className="lesson-back-row">
                <Link to={`/courses/${cId}/structure`} className="lesson-back-link">
                    <span className="material-symbols-outlined">arrow_back</span>
                    {t('course.back_to_structure')}
                </Link>
            </div>
            <div className="lesson-layout"><Spinner size="lg" /></div>
        </div>
    );

    if (error) return (
        <div className="page-wrapper-lesson">
            <Header variant="dashboard" />
            <div className="lesson-back-row">
                <Link to={`/courses/${cId}/structure`} className="lesson-back-link">
                    <span className="material-symbols-outlined">arrow_back</span>
                    {t('course.back_to_structure')}
                </Link>
            </div>
            <div className="lesson-layout"><p className="error-message">{error}</p></div>
        </div>
    );

    if (!lesson) return null;

    const content = lesson.content || '';

    return (
        <div className="page-wrapper-lesson">
            <Header variant="dashboard" />
            <div className="lesson-back-row">
                <Link to={`/courses/${cId}/structure`} className="lesson-back-link">
                    <span className="material-symbols-outlined">arrow_back</span>
                    {t('course.back_to_structure')}
                </Link>
            </div>
            <div className="lesson-layout">
                <aside className="lesson-sidebar">
                    {lesson.sectionName && (
                        <div className="sidebar-section-title">{lesson.sectionName}</div>
                    )}
                    <nav className="lesson-nav">
                        <Link to={`/courses/${cId}/lessons/${lId}`} className="lesson-nav-item active">
                            <span className="material-symbols-outlined nav-icon current-icon">play_circle</span>
                            {lesson.title}
                        </Link>
                    </nav>
                </aside>

                <div className="lesson-main">
                    <div className="lesson-breadcrumb">
                        <Link to={`/courses/${cId}`}>
                            {lesson.courseName || t('nav.courses')}
                        </Link>
                        <span className="material-symbols-outlined">chevron_right</span>
                        <span>{lesson.sectionName || ''}</span>
                    </div>

                    <div className="lesson-content-card">
                        <div className="lesson-header">
                            <h1 className="lesson-title">{lesson.title}</h1>
                            {lesson.updatedAt && (
                                <p className="lesson-updated">
                                    {t('lesson.updated', { date: new Intl.DateTimeFormat(undefined, { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(lesson.updatedAt)) })}
                                </p>
                            )}
                        </div>

                        <div className="lesson-body">
                            {content.split('\n\n').map((block, i) => {
                                if (block.startsWith('## ')) {
                                    return <h2 key={i} className="lesson-h2">{block.slice(3)}</h2>;
                                }
                                if (block.startsWith('- ')) {
                                    const items = block.split('\n').filter(l => l.startsWith('- '));
                                    return <ul key={i} className="lesson-list">{items.map((item, j) => <li key={j}>{renderBoldText(item.slice(2))}</li>)}</ul>;
                                }
                                if (block.startsWith('**') || block.includes('**')) {
                                    return <p key={i} className="lesson-paragraph">{renderBoldText(block)}</p>;
                                }
                                return <p key={i} className="lesson-paragraph">{block}</p>;
                            })}
                        </div>

                        {attachments.length > 0 && (
                            <div className="attachments-section">
                                <h3 className="attachments-title">
                                    <span className="material-symbols-outlined">attach_file</span>
                                    {t('lesson.materials_title')}
                                </h3>
                                <div className="attachments-grid">
                                    {attachments.map(att => {
                                        const style = getAttachmentStyle(att.type);
                                        return (
                                            <a key={att.id} href={att.fileUrl || att.url} target="_blank" rel="noopener noreferrer" className="attachment-item">
                                                <div className="att-icon" style={{ background: style.bg, color: style.color }}>
                                                    <span className="material-symbols-outlined">{style.icon}</span>
                                                </div>
                                                <div className="att-info">
                                                    <span className="att-title">{att.fileName || att.title}</span>
                                                    <span className="att-type">{att.type}</span>
                                                </div>
                                                <span className="material-symbols-outlined att-arrow">open_in_new</span>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="lesson-footer">
                            <button className={`btn-complete ${completed ? 'completed' : ''}`} onClick={handleComplete}>
                                <span className="material-symbols-outlined">
                                    {completed ? 'check_circle' : 'radio_button_unchecked'}
                                </span>
                                {completed ? t('lesson.completed') : t('lesson.mark_complete')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonView;
