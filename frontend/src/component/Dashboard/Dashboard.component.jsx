import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthContext from '../../context/AuthContext';
import Footer from '../Footer';
import Header from '../Header';
import Spinner from '../Spinner';
import { getAnnouncements } from '../../services/announcementService';
import { getUserEvents } from '../../services/eventService';
import { getCourses, getNearestAssignments } from '../../services/courseService';
import './Dashboard.scss';

const formatEventDate = (startTime, endTime) => {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return '';
    const dateFormatter = new Intl.DateTimeFormat(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeFormatter = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' });
    return `${dateFormatter.format(startDate)}, ${timeFormatter.format(startDate)}-${timeFormatter.format(endDate)}`;
};

const formatDate = (iso) => {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
};

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const { t } = useTranslation();
    const [events, setEvents] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [courses, setCourses] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    const userName = user?.username || t('auth.default_user');

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            setLoading(true);

            const [eventsResult, announcementsResult, coursesResult, assignmentsResult] =
                await Promise.allSettled([
                    getUserEvents(1, 3).catch(() => ({ items: [] })),
                    getAnnouncements(1, 2).catch(() => ({ items: [] })),
                    getCourses().catch(() => []),
                    getNearestAssignments().catch(() => [])
                ]);

            if (!mounted) return;

            const extractItems = (result) => {
                if (result.status === 'fulfilled') {
                    const val = result.value;
                    return val?.items || val?.Items || (Array.isArray(val) ? val : []);
                }
                return [];
            };

            setEvents(extractItems(eventsResult));
            setAnnouncements(extractItems(announcementsResult));
            setCourses(extractItems({ status: 'fulfilled', value: coursesResult.status === 'fulfilled' ? coursesResult.value : [] }));
            setAssignments(extractItems(assignmentsResult));
            setLoading(false);
        };

        load();
        return () => { mounted = false; };
    }, []);

    const upcomingEvents = useMemo(() =>
        events.slice().sort((a, b) => new Date(a.startTime) - new Date(b.startTime)),
        [events]
    );

    if (loading) {
        return (
            <div className="dashboard-wrapper">
                <div className="dashboard-container">
                    <main className="dashboard-main">
                        <Header variant="dashboard" />
                        <div className="dashboard-content"><Spinner size="lg" /></div>
                    </main>
                    <Footer />
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-container">
                <main className="dashboard-main">
                    <Header variant="dashboard" />
                    <div className="dashboard-content">
                        <div className="content-header">
                            <div className="welcome-section">
                                <h1 className="welcome-title">{t('dashboard.welcome_back', { userName })}</h1>
                                <p className="welcome-subtitle">{t('common.welcome')}</p>
                            </div>
                        </div>

                        <div className="dashboard-grid">
                            <section className="dashboard-section">
                                <h2 className="section-title">{t('dashboard.my_courses')}</h2>
                                <div className="courses-grid">
                                    {courses.length === 0 && <p>{t('course.no_courses')}</p>}
                                    {courses.slice(0, 4).map(course => (
                                        <Link key={course.id} to={`/courses/${course.id}`} className="course-card">
                                            <h3 className="course-name">{course.name}</h3>
                                            {course.owner && (
                                                <p className="course-instructor">
                                                    {t('course.instructor')}: {course.owner.firstName} {course.owner.lastName}
                                                </p>
                                            )}
                                            {course.description && (
                                                <p className="course-description">{course.description}</p>
                                            )}
                                        </Link>
                                    ))}
                                    {courses.length > 4 && (
                                        <Link to="/courses" className="see-all-link">{t('course.see_all')}</Link>
                                    )}
                                </div>
                            </section>

                            <section className="dashboard-section">
                                <div className="section-header">
                                    <h2 className="section-title">{t('calendar.upcoming')}</h2>
                                    {(user?.role === 'Admin' || user?.role === 'Teacher') && (
                                        <Link to="/events/create" className="section-action">
                                            <span className="material-symbols-outlined">add</span>
                                            {t('dashboard.add_event')}
                                        </Link>
                                    )}
                                </div>
                                <div className="events-card">
                                    {upcomingEvents.length === 0 && <p className="dashboard-feedback">{t('calendar.no_upcoming')}</p>}
                                    {upcomingEvents.map(eventItem => (
                                        <div key={eventItem.id} className="event-item">
                                            <div className="event-icon primary">
                                                <span className="material-symbols-outlined">event</span>
                                            </div>
                                            <div className="event-info">
                                                <p className="event-title">{eventItem.title}</p>
                                                <p className="event-details">
                                                    {formatEventDate(eventItem.startTime, eventItem.endTime)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="dashboard-section">
                                <div className="section-header">
                                    <h2 className="section-title">{t('announcement.recent')}</h2>
                                    {user?.role === 'Admin' && (
                                        <Link to="/announcements/create" className="section-action">
                                            <span className="material-symbols-outlined">add</span>
                                            {t('dashboard.add_announcement')}
                                        </Link>
                                    )}
                                </div>
                                <div className="announcements-card">
                                    {announcements.length === 0 && <p className="dashboard-feedback">{t('announcement.no_new')}</p>}
                                    {announcements.map(announcement => (
                                        <div key={announcement.id} className="announcement-item">
                                            <p className="announcement-date">{formatDate(announcement.createdAt)}</p>
                                            <p className="announcement-title">{announcement.title}</p>
                                            <p className="announcement-text">{announcement.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="dashboard-section">
                                <div className="section-header">
                                    <h2 className="section-title">{t('assignment.upcoming')}</h2>
                                    <Link to="/assignments" className="section-action">
                                        {t('common.see_all')}
                                    </Link>
                                </div>
                                <div className="assignments-card">
                                    {assignments.length === 0 && <p className="dashboard-feedback">{t('assignment.no_upcoming')}</p>}
                                    {assignments.map(a => (
                                        <Link key={a.id || a.assignmentId} to={`/assignments/${a.id}/quiz`} className="assignment-item">
                                            <span className="material-symbols-outlined assignment-item-icon">
                                                {a.taskType === 'Quiz' ? 'quiz' : a.taskType === 'Test' ? 'assignment' : 'edit_document'}
                                            </span>
                                            <div className="assignment-item-info">
                                                <p className="assignment-item-title">{a.title || a.assignmentTitle}</p>
                                                {a.courseSectionTitle && (
                                                    <p className="assignment-item-section">{a.courseSectionTitle}</p>
                                                )}
                                            </div>
                                            <p className="assignment-item-due">{formatDate(a.dueDate || a.deadline)}</p>
                                        </Link>
                                    ))}
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
