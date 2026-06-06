import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../../Header';
import { request } from '../../../services/apiClient';
import { getCourseSections } from '../../../services/courseService';
import './LessonView.scss';

const ATTACHMENT_COLORS = {
    Video: { bg: '#fee2e2', color: '#dc2626', icon: 'play_circle' },
    Pdf: { bg: '#fef3c7', color: '#d97706', icon: 'picture_as_pdf' },
    Image: { bg: '#dcfce7', color: '#16a34a', icon: 'image' },
    Link: { bg: '#e0f2fe', color: 'rgb(58 124 165)', icon: 'link' },
};

const LessonView = () => {
    const { cId, lId } = useParams();
    const [lesson, setLesson] = useState(null);
    const [attachments, setAttachments] = useState([]);
    const [sections, setSections] = useState([]);
    const [completed, setCompleted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [lessonData, attachmentsData, sectionsData] = await Promise.all([
                    request(`/api/SectionMaterial/${lId}`),
                    request(`/api/LessonAttachment/lessons/${lId}/attachments`).catch(() => []),
                    getCourseSections(cId).catch(() => [])
                ]);
                setLesson(lessonData);
                setAttachments(Array.isArray(attachmentsData) ? attachmentsData : []);
                setSections(Array.isArray(sectionsData) ? sectionsData : []);
            } catch {
                // failed to load
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [cId, lId]);

    if (loading) {
        return (
            <div className="page-wrapper-lesson">
                <Header variant="dashboard" />
                <div className="lesson-layout">
                    <div className="lesson-main">
                        <p>Ładowanie lekcji...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="page-wrapper-lesson">
                <Header variant="dashboard" />
                <div className="lesson-layout">
                    <div className="lesson-main">
                        <Link to={`/courses/${cId}/structure`} className="back-link">
                            <span className="material-symbols-outlined">arrow_back</span>
                            Wróć do kursu
                        </Link>
                        <p>Nie znaleziono lekcji.</p>
                    </div>
                </div>
            </div>
        );
    }

    // Find current section and build prev/next navigation
    const allMaterials = sections.flatMap(s => (s.materials || []).map(m => ({ ...m, sectionTitle: s.title })));
    const currentIndex = allMaterials.findIndex(m => m.id === lId || m.id === lesson.id);
    const prevLesson = currentIndex > 0 ? allMaterials[currentIndex - 1] : null;
    const nextLesson = currentIndex >= 0 && currentIndex < allMaterials.length - 1 ? allMaterials[currentIndex + 1] : null;

    const currentSection = sections.find(s => (s.materials || []).some(m => m.id === lId || m.id === lesson.id));

    return (
        <div className="page-wrapper-lesson">
            <Header variant="dashboard" />
            <div className="lesson-layout">
                {/* Sidebar nav */}
                <aside className="lesson-sidebar">
                    <div className="sidebar-section-title">{currentSection?.title || ''}</div>
                    <nav className="lesson-nav">
                        {(currentSection?.materials || []).map(m => (
                            <Link
                                key={m.id}
                                to={`/courses/${cId}/lessons/${m.id}`}
                                className={`lesson-nav-item ${m.id === lId ? 'active' : ''}`}
                            >
                                <span className="material-symbols-outlined nav-icon">
                                    {m.id === lId ? 'play_circle' : 'radio_button_unchecked'}
                                </span>
                                {m.title}
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Main content */}
                <div className="lesson-main">
                    <div className="lesson-breadcrumb">
                        <Link to={`/courses/${cId}/structure`}>Kurs</Link>
                        <span className="material-symbols-outlined">chevron_right</span>
                        <span>{currentSection?.title || ''}</span>
                    </div>

                    <div className="lesson-content-card">
                        <div className="lesson-header">
                            <h1 className="lesson-title">{lesson.title}</h1>
                            {lesson.updatedAt && (
                                <p className="lesson-updated">
                                    Ostatnia aktualizacja: {new Intl.DateTimeFormat('pl-PL', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(lesson.updatedAt))}
                                </p>
                            )}
                        </div>

                        <div className="lesson-body">
                            {(lesson.content || '').split('\n\n').map((block, i) => {
                                if (block.startsWith('## ')) {
                                    return <h2 key={i} className="lesson-h2">{block.slice(3)}</h2>;
                                }
                                if (block.startsWith('**') || block.includes('**')) {
                                    return <p key={i} className="lesson-paragraph" dangerouslySetInnerHTML={{ __html: block.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />;
                                }
                                if (block.startsWith('- ')) {
                                    const items = block.split('\n').filter(l => l.startsWith('- '));
                                    return <ul key={i} className="lesson-list">{items.map((item, j) => <li key={j} dangerouslySetInnerHTML={{ __html: item.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />)}</ul>;
                                }
                                return <p key={i} className="lesson-paragraph">{block}</p>;
                            })}
                        </div>

                        {/* Attachments */}
                        {attachments.length > 0 && (
                            <div className="attachments-section">
                                <h3 className="attachments-title">
                                    <span className="material-symbols-outlined">attach_file</span>
                                    Materiały do lekcji
                                </h3>
                                <div className="attachments-grid">
                                    {attachments.map(att => {
                                        const style = ATTACHMENT_COLORS[att.type] || ATTACHMENT_COLORS.Link;
                                        return (
                                            <a
                                                key={att.id}
                                                href={att.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="attachment-item"
                                            >
                                                <div className="att-icon" style={{ background: style.bg, color: style.color }}>
                                                    <span className="material-symbols-outlined">{style.icon}</span>
                                                </div>
                                                <div className="att-info">
                                                    <span className="att-title">{att.title || att.fileName}</span>
                                                    <span className="att-type">{att.type}</span>
                                                </div>
                                                <span className="material-symbols-outlined att-arrow">open_in_new</span>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Complete button + nav */}
                        <div className="lesson-footer">
                            <button
                                className={`btn-complete ${completed ? 'completed' : ''}`}
                                onClick={() => setCompleted(true)}
                            >
                                <span className="material-symbols-outlined">
                                    {completed ? 'check_circle' : 'radio_button_unchecked'}
                                </span>
                                {completed ? 'Lekcja ukończona' : 'Oznacz jako ukończoną'}
                            </button>

                            <div className="lesson-nav-btns">
                                {prevLesson && (
                                    <Link to={`/courses/${cId}/lessons/${prevLesson.id}`} className="btn-nav-lesson prev">
                                        <span className="material-symbols-outlined">arrow_back</span>
                                        <div>
                                            <span className="nav-direction">Poprzednia</span>
                                            <span className="nav-lesson-title">{prevLesson.title}</span>
                                        </div>
                                    </Link>
                                )}
                                {nextLesson && (
                                    <Link to={`/courses/${cId}/lessons/${nextLesson.id}`} className="btn-nav-lesson next">
                                        <div>
                                            <span className="nav-direction">Następna</span>
                                            <span className="nav-lesson-title">{nextLesson.title}</span>
                                        </div>
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonView;
