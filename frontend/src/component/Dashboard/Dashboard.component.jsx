import React, { useContext, useEffect, useMemo, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import Footer from '../Footer';
import Header from '../Header';
import { getAnnouncements } from '../../services/announcementService';
import { getUserEvents } from '../../services/eventService';
import './Dashboard.scss';

const EVENT_ICONS = [
    { icon: 'assignment', colorClass: 'primary' },
    { icon: 'quiz', colorClass: 'orange' },
    { icon: 'task', colorClass: 'purple' }
];

const formatEventDate = (startTime, endTime) => {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
        return 'Termin nieznany';
    }

    const dateFormatter = new Intl.DateTimeFormat('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    const timeFormatter = new Intl.DateTimeFormat('pl-PL', {
        hour: '2-digit',
        minute: '2-digit'
    });

    return `Termin: ${dateFormatter.format(startDate)}, ${timeFormatter.format(startDate)}-${timeFormatter.format(endDate)}`;
};

const formatAnnouncementDate = (createdAt) => {
    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) {
        return 'Brak daty';
    }

    return new Intl.DateTimeFormat('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
};

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [announcementsLoading, setAnnouncementsLoading] = useState(true);
    const [eventsError, setEventsError] = useState('');
    const [announcementsError, setAnnouncementsError] = useState('');

    const userName = user?.username || 'Użytkowniku';

    useEffect(() => {
        let isMounted = true;

        const loadDashboardData = async () => {
            setEventsLoading(true);
            setAnnouncementsLoading(true);
            setEventsError('');
            setAnnouncementsError('');

            const [eventsResult, announcementsResult] = await Promise.allSettled([
                getUserEvents(1, 3),
                getAnnouncements(1, 2)
            ]);

            if (!isMounted) {
                return;
            }

            if (eventsResult.status === 'fulfilled') {
                setEvents(eventsResult.value?.items || eventsResult.value?.Items || []);
            } else {
                setEvents([]);
                setEventsError(eventsResult.reason?.message || 'Nie udało się pobrać wydarzeń.');
            }

            if (announcementsResult.status === 'fulfilled') {
                setAnnouncements(announcementsResult.value?.items || announcementsResult.value?.Items || []);
            } else {
                setAnnouncements([]);
                setAnnouncementsError(announcementsResult.reason?.message || 'Nie udało się pobrać ogłoszeń.');
            }

            setEventsLoading(false);
            setAnnouncementsLoading(false);
        };

        loadDashboardData();

        return () => {
            isMounted = false;
        };
    }, []);

    const upcomingEvents = useMemo(() => events
        .slice()
        .sort((left, right) => new Date(left.startTime) - new Date(right.startTime)), [events]);

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-container">
                <main className="dashboard-main">
                    <Header variant="dashboard" />

                    {/* Content */}
                    <div className="dashboard-content">
                        <div className="content-header">
                            <div className="welcome-section">
                                <h1 className="welcome-title">Witaj z powrotem, {userName}!</h1>
                                <p className="welcome-subtitle">Sprawdźmy, co nowego u Ciebie.</p>
                            </div>
                        </div>

                        <div className="dashboard-grid">
                            {/* My Courses Section */}
                            <section className="dashboard-section">
                                <h2 className="section-title">Moje kursy</h2>
                                <div className="courses-grid">
                                    <div className="course-card">
                                        <h3 className="course-name">UX/UI Design</h3>
                                        <p className="course-instructor">Prowadzący: dr Anna Nowak</p>
                                        <div className="progress-section">
                                            <div className="progress-header">
                                                <span className="progress-label">Postęp</span>
                                                <span className="progress-value">75%</span>
                                            </div>
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{ width: '75%' }}></div>
                                            </div>
                                        </div>
                                        <button className="continue-button">Kontynuuj naukę</button>
                                    </div>
                                    <div className="course-card">
                                        <h3 className="course-name">Wprowadzenie do Pythona</h3>
                                        <p className="course-instructor">Prowadzący: dr hab. Piotr Zieliński</p>
                                        <div className="progress-section">
                                            <div className="progress-header">
                                                <span className="progress-label">Postęp</span>
                                                <span className="progress-value">40%</span>
                                            </div>
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{ width: '40%' }}></div>
                                            </div>
                                        </div>
                                        <button className="continue-button">Kontynuuj naukę</button>
                                    </div>
                                </div>
                            </section>

                            {/* Upcoming Events Section */}
                            <section className="dashboard-section">
                                <h2 className="section-title">Nadchodzące wydarzenia</h2>
                                <div className="events-card">
                                    {eventsLoading ? <p className="dashboard-feedback">Ładowanie wydarzeń...</p> : null}
                                    {!eventsLoading && eventsError ? <p className="dashboard-feedback dashboard-feedback--error">{eventsError}</p> : null}
                                    {!eventsLoading && !eventsError && upcomingEvents.length === 0 ? (
                                        <p className="dashboard-feedback">Brak nadchodzących wydarzeń.</p>
                                    ) : null}
                                    {!eventsLoading && !eventsError ? upcomingEvents.map((eventItem, index) => {
                                        const eventVisual = EVENT_ICONS[index % EVENT_ICONS.length];

                                        return (
                                            <div key={eventItem.id} className="event-item">
                                                <div className={`event-icon ${eventVisual.colorClass}`}>
                                                    <span className="material-symbols-outlined">{eventVisual.icon}</span>
                                                </div>
                                                <div className="event-info">
                                                    <p className="event-title">{eventItem.title}</p>
                                                    <p className="event-details">
                                                        {eventItem.description ? `${eventItem.description} • ` : ''}
                                                        {formatEventDate(eventItem.startTime, eventItem.endTime)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    }) : null}
                                </div>
                            </section>

                            {/* Announcements Section */}
                            <section className="dashboard-section">
                                <h2 className="section-title">Ostatnie ogłoszenia</h2>
                                <div className="announcements-card">
                                    {announcementsLoading ? <p className="dashboard-feedback">Ładowanie ogłoszeń...</p> : null}
                                    {!announcementsLoading && announcementsError ? <p className="dashboard-feedback dashboard-feedback--error">{announcementsError}</p> : null}
                                    {!announcementsLoading && !announcementsError && announcements.length === 0 ? (
                                        <p className="dashboard-feedback">Brak nowych ogłoszeń.</p>
                                    ) : null}
                                    {!announcementsLoading && !announcementsError ? announcements.map((announcement) => (
                                        <div key={announcement.id} className="announcement-item">
                                            <p className="announcement-date">{formatAnnouncementDate(announcement.createdAt)}</p>
                                            <p className="announcement-title">{announcement.title}</p>
                                            <p className="announcement-text">{announcement.content}</p>
                                        </div>
                                    )) : null}
                                    <button className="see-all-button">Zobacz wszystkie</button>
                                </div>
                            </section>

                            {/* Progress Section */}
                            <section className="dashboard-section">
                                <h2 className="section-title">Postępy w tym tygodniu</h2>
                                <div className="progress-card">
                                    <div className="progress-circle">
                                        <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                                            <circle className="progress-circle-bg" cx="18" cy="18" fill="none" r="16" strokeWidth="3"></circle>
                                            <circle className="progress-circle-fill" cx="18" cy="18" fill="none" r="16" strokeDasharray="100" strokeDashoffset="35" strokeWidth="3" transform="rotate(-90 18 18)"></circle>
                                        </svg>
                                        <div className="progress-circle-text">
                                            <span className="progress-percent">65%</span>
                                            <span className="progress-label">Ukończono</span>
                                        </div>
                                    </div>
                                    <p className="progress-description">Świetna robota! Ukończyłeś 65% zaplanowanych lekcji na ten tydzień.</p>
                                </div>
                            </section>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default Dashboard;
