import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../../Header';
import './LessonView.scss';

const STATIC_LESSON = {
    id: 'l1',
    title: 'Podstawy teorii kolorów w projektowaniu UI',
    courseId: 'course1',
    courseName: 'UX/UI Design',
    sectionTitle: 'Moduł 3: Kolory i typografia',
    updatedAt: '2026-05-10T12:00:00',
    content: `## Teoria kolorów – wprowadzenie

Kolory odgrywają kluczową rolę w projektowaniu interfejsów użytkownika. Właściwy dobór palety barw wpływa na czytelność, estetykę i emocje wywoływane przez produkt.

## Koło barw i relacje kolorów

**Kolory podstawowe**: czerwony, żółty, niebieski (model RYB) lub czerwony, zielony, niebieski (model RGB używany na ekranach).

**Schematy kolorystyczne:**
- **Monochromatyczny** – odcienie jednego koloru
- **Analogiczny** – kolory sąsiadujące na kole barw
- **Komplementarny** – kolory naprzeciwległe na kole barw
- **Triadyczny** – trzy równo rozmieszczone kolory

## Kontrast i dostępność

Standard WCAG AA wymaga kontrastu co najmniej 4.5:1 dla tekstu normalnego i 3:1 dla tekstu dużego. Używaj narzędzi jak Contrast Checker, aby weryfikować dostępność.

## Psychologia kolorów

Każdy kolor niesie ze sobą skojarzenia kulturowe i emocjonalne:
- **Niebieski** – zaufanie, spokój, profesjonalizm
- **Zielony** – natura, wzrost, sukces
- **Czerwony** – energia, pilność, ostrzeżenie
- **Żółty** – optymizm, uwaga, ciepło`,
    attachments: [
        { id: 'a1', type: 'Video', title: 'Teoria kolorów – wideo wprowadzające (15 min)', url: 'https://youtube.com/watch?v=example1', icon: 'play_circle' },
        { id: 'a2', type: 'Pdf', title: 'Slajdy z wykładu – Moduł 3', url: 'https://drive.google.com/example-slides.pdf', icon: 'picture_as_pdf' },
        { id: 'a3', type: 'Link', title: 'Coolors – generator palet kolorystycznych', url: 'https://coolors.co', icon: 'link' },
        { id: 'a4', type: 'Link', title: 'WebAIM Contrast Checker', url: 'https://webaim.org/resources/contrastchecker', icon: 'link' },
    ],
    prevLesson: { id: 'l0', title: 'Wprowadzenie do modułu 3' },
    nextLesson: { id: 'l2', title: 'Typografia – kroje pisma i hierarchia' },
};

const ATTACHMENT_COLORS = {
    Video: { bg: '#fee2e2', color: '#dc2626', icon: 'play_circle' },
    Pdf: { bg: '#fef3c7', color: '#d97706', icon: 'picture_as_pdf' },
    Image: { bg: '#dcfce7', color: '#16a34a', icon: 'image' },
    Link: { bg: '#e0f2fe', color: 'rgb(58 124 165)', icon: 'link' },
};

const LessonView = () => {
    const { cId, lId } = useParams();
    const [completed, setCompleted] = useState(false);

    return (
        <div className="page-wrapper-lesson">
            <Header variant="dashboard" />
            <div className="lesson-layout">
                {/* Sidebar nav */}
                <aside className="lesson-sidebar">
                    <div className="sidebar-section-title">{STATIC_LESSON.sectionTitle}</div>
                    <nav className="lesson-nav">
                        <Link to="#" className="lesson-nav-item">
                            <span className="material-symbols-outlined nav-icon done-icon">check_circle</span>
                            Wprowadzenie do modułu 3
                        </Link>
                        <Link to="#" className="lesson-nav-item active">
                            <span className="material-symbols-outlined nav-icon current-icon">play_circle</span>
                            Podstawy teorii kolorów
                        </Link>
                        <Link to="#" className="lesson-nav-item">
                            <span className="material-symbols-outlined nav-icon">radio_button_unchecked</span>
                            Typografia – kroje pisma
                        </Link>
                        <Link to="#" className="lesson-nav-item">
                            <span className="material-symbols-outlined nav-icon">radio_button_unchecked</span>
                            Ćwiczenia praktyczne
                        </Link>
                    </nav>
                </aside>

                {/* Main content */}
                <div className="lesson-main">
                    <div className="lesson-breadcrumb">
                        <Link to={`/courses/${STATIC_LESSON.courseId}`}>{STATIC_LESSON.courseName}</Link>
                        <span className="material-symbols-outlined">chevron_right</span>
                        <span>{STATIC_LESSON.sectionTitle}</span>
                    </div>

                    <div className="lesson-content-card">
                        <div className="lesson-header">
                            <h1 className="lesson-title">{STATIC_LESSON.title}</h1>
                            <p className="lesson-updated">
                                Ostatnia aktualizacja: {new Intl.DateTimeFormat('pl-PL', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(STATIC_LESSON.updatedAt))}
                            </p>
                        </div>

                        <div className="lesson-body">
                            {STATIC_LESSON.content.split('\n\n').map((block, i) => {
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
                        {STATIC_LESSON.attachments.length > 0 && (
                            <div className="attachments-section">
                                <h3 className="attachments-title">
                                    <span className="material-symbols-outlined">attach_file</span>
                                    Materiały do lekcji
                                </h3>
                                <div className="attachments-grid">
                                    {STATIC_LESSON.attachments.map(att => {
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
                                                    <span className="att-title">{att.title}</span>
                                                    <span className="att-type">{att.type}</span>
                                                </div>
                                                <span className="material-symbols-outlined att-arrow">open_in_new</span>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Complete button */}
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
                                {STATIC_LESSON.prevLesson && (
                                    <Link to={`/courses/${STATIC_LESSON.courseId}/lessons/${STATIC_LESSON.prevLesson.id}`} className="btn-nav-lesson prev">
                                        <span className="material-symbols-outlined">arrow_back</span>
                                        <div>
                                            <span className="nav-direction">Poprzednia</span>
                                            <span className="nav-lesson-title">{STATIC_LESSON.prevLesson.title}</span>
                                        </div>
                                    </Link>
                                )}
                                {STATIC_LESSON.nextLesson && (
                                    <Link to={`/courses/${STATIC_LESSON.courseId}/lessons/${STATIC_LESSON.nextLesson.id}`} className="btn-nav-lesson next">
                                        <div>
                                            <span className="nav-direction">Następna</span>
                                            <span className="nav-lesson-title">{STATIC_LESSON.nextLesson.title}</span>
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
