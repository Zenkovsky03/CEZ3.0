import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../Header';
import './HomeworkSubmit.scss';

const STATIC_HOMEWORK = {
    title: 'Praca domowa: Projekt makiety UX',
    course: 'UX/UI Design',
    dueDate: '2026-05-20T23:59:00',
    description: `Stwórz makietę (wireframe) dla mobilnej aplikacji e-commerce. Projekt powinien zawierać:
    
1. Ekran listy produktów z filtrowaniem i sortowaniem
2. Ekran szczegółów produktu z galerią zdjęć
3. Koszyk zakupowy z podsumowaniem zamówienia
4. Ekran finalizacji zakupu

Wymagania techniczne:
- Użyj narzędzia Figma lub Adobe XD
- Zachowaj spójność systemu designu
- Opisz kluczowe interakcje w komentarzach

Oddaj link do projektu lub plik PDF z makietami.`,
};

const formatDate = (iso) =>
    new Intl.DateTimeFormat('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

const HomeworkSubmit = () => {
    const { id } = useParams();
    const [submissionText, setSubmissionText] = useState('');
    const [attachmentUrl, setAttachmentUrl] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="page-wrapper-homework">
                <Header variant="dashboard" />
                <div className="main-content">
                    <div className="success-card">
                        <span className="material-symbols-outlined success-icon">task_alt</span>
                        <h2 className="success-title">Praca oddana!</h2>
                        <p className="success-subtitle">
                            Twoja praca została pomyślnie przesłana. Nauczyciel oceni ją wkrótce.
                        </p>
                        <Link to="/assignments" className="btn-primary">
                            <span className="material-symbols-outlined">arrow_back</span>
                            Powrót do zadań
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper-homework">
            <Header variant="dashboard" />
            <div className="main-content">
                <Link to="/assignments" className="back-link">
                    <span className="material-symbols-outlined">arrow_back</span>
                    Powrót do zadań
                </Link>

                <div className="homework-grid">
                    {/* Left: assignment details */}
                    <div className="homework-details-card">
                        <div className="hw-card-header">
                            <div className="hw-icon">
                                <span className="material-symbols-outlined">edit_document</span>
                            </div>
                            <div>
                                <span className="hw-type-chip">Praca domowa</span>
                                <p className="hw-course">{STATIC_HOMEWORK.course}</p>
                            </div>
                        </div>

                        <h2 className="hw-title">{STATIC_HOMEWORK.title}</h2>

                        <div className="hw-due">
                            <span className="material-symbols-outlined">schedule</span>
                            <span>Termin: <strong>{formatDate(STATIC_HOMEWORK.dueDate)}</strong></span>
                        </div>

                        <div className="hw-description-label">Opis zadania</div>
                        <div className="hw-description">
                            {STATIC_HOMEWORK.description.split('\n').map((line, i) => (
                                <p key={i}>{line}</p>
                            ))}
                        </div>
                    </div>

                    {/* Right: submission form */}
                    <div className="submission-card">
                        <h3 className="submission-title">Oddaj pracę</h3>
                        <form onSubmit={handleSubmit} className="submission-form">
                            <div className="form-group">
                                <label className="form-label">
                                    Opis / komentarz
                                    <span className="form-optional">opcjonalne</span>
                                </label>
                                <textarea
                                    className="form-textarea"
                                    placeholder="Opisz swoją pracę, podaj informacje dodatkowe lub wnioski..."
                                    value={submissionText}
                                    onChange={(e) => setSubmissionText(e.target.value)}
                                    rows={6}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Link do pracy
                                    <span className="form-required">*</span>
                                </label>
                                <div className="input-with-icon">
                                    <span className="material-symbols-outlined input-icon">link</span>
                                    <input
                                        type="url"
                                        className="form-input"
                                        placeholder="https://www.figma.com/file/..."
                                        value={attachmentUrl}
                                        onChange={(e) => setAttachmentUrl(e.target.value)}
                                        required
                                    />
                                </div>
                                <p className="form-hint">Podaj link do Figmy, Google Drive, GitHub lub innego serwisu</p>
                            </div>

                            <button
                                type="submit"
                                className="btn-submit"
                                disabled={!attachmentUrl.trim()}
                            >
                                <span className="material-symbols-outlined">send</span>
                                Wyślij pracę
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeworkSubmit;
