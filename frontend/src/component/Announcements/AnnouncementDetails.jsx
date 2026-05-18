import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../Header';
import './Announcements.scss';

const STATIC_ANNOUNCEMENT = {
    id: 'a1',
    title: 'Zmiana terminu wykładu – tydzień 8',
    course: { id: 'c1', name: 'UX/UI Design' },
    author: { name: 'dr Anna Nowak', avatar: 'AN' },
    createdAt: '2026-05-20T09:15:00',
    content: `Szanowni Studenci,

Informuję, że wykład zaplanowany na środę 22 maja (godz. 10:15) zostaje przeniesiony na czwartek 23 maja w godzinach 12:00–13:30 w sali 204.

Zmiana jest spowodowana moją uczestnictwem w konferencji naukowej w dniach 22–23 maja.

Materiały z poprzedniego wykładu znajdziecie w sekcji "Materiały" kursu. Proszę o zapoznanie się z nimi przed zajęciami.

W razie pytań proszę o kontakt przez system wiadomości.

Z poważaniem,
dr Anna Nowak`,
};

const AnnouncementDetails = () => {
    const { id } = useParams();

    return (
        <div className="page-wrapper-announcements">
            <Header variant="dashboard" />
            <div className="main-content narrow">
                <Link to="/courses" className="back-link">
                    <span className="material-symbols-outlined">arrow_back</span>
                    Kursy
                </Link>

                <div className="announcement-detail-card">
                    <div className="ann-course-tag">
                        <span className="material-symbols-outlined">school</span>
                        {STATIC_ANNOUNCEMENT.course.name}
                    </div>

                    <h1 className="ann-detail-title">{STATIC_ANNOUNCEMENT.title}</h1>

                    <div className="ann-author-row">
                        <div className="ann-avatar">{STATIC_ANNOUNCEMENT.author.avatar}</div>
                        <div>
                            <span className="ann-author-name">{STATIC_ANNOUNCEMENT.author.name}</span>
                            <span className="ann-post-date">
                                {' · '}
                                {new Intl.DateTimeFormat('pl-PL', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(STATIC_ANNOUNCEMENT.createdAt))}
                            </span>
                        </div>
                    </div>

                    <div className="ann-divider" />

                    <div className="ann-body">
                        {STATIC_ANNOUNCEMENT.content.split('\n\n').map((para, i) => (
                            <p key={i}>{para}</p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementDetails;
