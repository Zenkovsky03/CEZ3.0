import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { getUserEvents, deleteEvent } from '../../services/eventService';
import Footer from '../Footer';
import Header from '../Header';
import Spinner from '../Spinner';
import Modal from '../Modal';
import './CalendarPage.scss';

const WEEK_DAYS = ['weekday.mon', 'weekday.tue', 'weekday.wed', 'weekday.thu', 'weekday.fri', 'weekday.sat', 'weekday.sun'];
const MAX_EVENTS_PER_DAY = 2;

const toDateKey = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return null;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const isSameDay = (first, second) => (
    first.getFullYear() === second.getFullYear()
    && first.getMonth() === second.getMonth()
    && first.getDate() === second.getDate()
);

const startOfMonthGrid = (date) => {
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayIndex = (monthStart.getDay() + 6) % 7;
    monthStart.setDate(monthStart.getDate() - dayIndex);
    return monthStart;
};

const buildCalendarDays = (date) => {
    const startDate = startOfMonthGrid(date);
    return Array.from({ length: 42 }, (_, index) => {
        const current = new Date(startDate);
        current.setDate(startDate.getDate() + index);
        return current;
    });
};

const formatMonth = (value) => new Intl.DateTimeFormat(undefined, {
    month: 'long',
    year: 'numeric'
}).format(value);

const formatDateTime = (value) => new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
}).format(new Date(value));

const formatTimeRange = (start, end, t) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
        return t ? t('calendar.invalid_date') : '';
    }

    const sameDay = isSameDay(startDate, endDate);
    const timeFormatter = new Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit'
    });

    if (sameDay) {
        return `${formatDateTime(start)} • ${timeFormatter.format(startDate)}-${timeFormatter.format(endDate)}`;
    }

    return `${formatDateTime(start)} - ${formatDateTime(end)}`;
};

const normalizeEvents = (items) => items
    .map((item) => ({
        ...item,
        startDate: new Date(item.startTime),
        endDate: new Date(item.endTime)
    }))
    .filter((item) => !Number.isNaN(item.startDate.getTime()))
    .sort((left, right) => left.startDate - right.startDate);

const isUpcomingEvent = (eventItem, now = new Date()) => eventItem.startDate >= now;

const CalendarPage = () => {
    const { user } = useContext(AuthContext);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [currentMonth, setCurrentMonth] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });
    const [selectedDate, setSelectedDate] = useState(() => new Date());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadEvents = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await getUserEvents(1, 30);
                if (isMounted) {
                    setEvents(normalizeEvents(response?.items || response?.Items || []));
                }
            } catch (fetchError) {
                if (isMounted) {
                    setError(fetchError.message || t('error.load_events'));
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadEvents();

        return () => {
            isMounted = false;
        };
    }, [t]);

    const eventsByDate = useMemo(() => events.reduce((accumulator, eventItem) => {
        const key = toDateKey(eventItem.startDate);
        if (!key) {
            return accumulator;
        }

        if (!accumulator[key]) {
            accumulator[key] = [];
        }

        accumulator[key].push(eventItem);
        return accumulator;
    }, {}), [events]);

    const calendarDays = useMemo(() => buildCalendarDays(currentMonth), [currentMonth]);

    const selectedDateKey = toDateKey(selectedDate);
    const selectedDayEvents = selectedDateKey ? (eventsByDate[selectedDateKey] || []) : [];
    const plannedEvents = useMemo(() => {
        const now = new Date();
        return events.filter((eventItem) => isUpcomingEvent(eventItem, now));
    }, [events]);

    const upcomingEvents = useMemo(() => plannedEvents.slice(0, 6), [plannedEvents]);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const canCreateEvents = user?.role === 'Admin' || user?.role === 'Teacher';

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-container">
                <main className="dashboard-main">
                    <Header variant="dashboard" />

                    <div className="dashboard-content">
                        <div className="calendar-page-shell">
                            <div className="calendar-page__hero">
                                <div>
                                    <h1 className="calendar-page__title">{t('calendar.title')}</h1>
                                    <p className="calendar-page__subtitle">{t('calendar.subtitle')}</p>
                                </div>
                                <div className="calendar-page__hero-actions">
                                    <div className="calendar-page__status">
                                        <span className="material-symbols-outlined">event</span>
                                        {t('calendar.planned', { count: plannedEvents.length })}
                                    </div>
                                    {canCreateEvents && (
                                        <Link to="/events/create" className="calendar-page__btn">
                                            <span className="material-symbols-outlined">add</span>
                                            {t('calendar.add_event')}
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {loading ? (
                                <div className="calendar-card calendar-page__loading"><Spinner /></div>
                            ) : (
                                <div className="calendar-page">
                                    <section className="calendar-page__main">
                                        <div className="calendar-card">
                                            <div className="calendar-card__toolbar">
                                                <div>
                                                    <div className="calendar-card__month">{formatMonth(currentMonth)}</div>
                                                    <div className="calendar-card__toolbar-label">{t('calendar.click_hint')}</div>
                                                </div>
                                                <div className="calendar-card__toolbar-group">
                                                    <button
                                                        className="calendar-card__button"
                                                        type="button"
                                                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                                                        aria-label={t('calendar.prev_month')}
                                                    >
                                                        <span className="material-symbols-outlined">chevron_left</span>
                                                    </button>
                                                    <button
                                                        className="calendar-card__button"
                                                        type="button"
                                                        onClick={() => {
                                                            const today = new Date();
                                                            setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
                                                            setSelectedDate(today);
                                                        }}
                                                    >
                                                        <span className="material-symbols-outlined">today</span>
                                                    </button>
                                                    <button
                                                        className="calendar-card__button"
                                                        type="button"
                                                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                                                        aria-label={t('calendar.next_month')}
                                                    >
                                                        <span className="material-symbols-outlined">chevron_right</span>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="calendar-grid">
                                                {WEEK_DAYS.map((weekDay) => (
                                                    <div key={weekDay} className="calendar-grid__weekday">{t(weekDay)}</div>
                                                ))}

                                                {calendarDays.map((day) => {
                                                    const dayKey = toDateKey(day);
                                                    const dayEvents = dayKey ? (eventsByDate[dayKey] || []) : [];
                                                    const isToday = isSameDay(day, new Date());
                                                    const isSelected = isSameDay(day, selectedDate);
                                                    const isOutsideMonth = day.getMonth() !== currentMonth.getMonth();

                                                    return (
                                                        <button
                                                            key={day.toISOString()}
                                                            type="button"
                                                            className={[
                                                                'calendar-grid__day',
                                                                isOutsideMonth ? 'calendar-grid__day--outside' : '',
                                                                isToday ? 'calendar-grid__day--today' : '',
                                                                isSelected ? 'calendar-grid__day--selected' : ''
                                                            ].filter(Boolean).join(' ')}
                                                            onClick={() => setSelectedDate(day)}
                                                        >
                                                            <div className="calendar-grid__day-header">
                                                                <span className="calendar-grid__day-number">{day.getDate()}</span>
                                                                {dayEvents.length > 0 ? <span className="calendar-grid__badge">{dayEvents.length}</span> : null}
                                                            </div>

                                                            <div className="calendar-grid__events">
                                                                {dayEvents.slice(0, MAX_EVENTS_PER_DAY).map((eventItem) => (
                                                                    <div key={eventItem.id} className="calendar-grid__event" title={eventItem.title}>
                                                                        {eventItem.title}
                                                                    </div>
                                                                ))}
                                                                {dayEvents.length > MAX_EVENTS_PER_DAY ? (
                                                                    <span className="calendar-grid__more">{t('calendar.more', { count: dayEvents.length - MAX_EVENTS_PER_DAY })}</span>
                                                                ) : null}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </section>

                                    <aside className="calendar-page__sidebar">
                                        <div className="calendar-panel">
                                            <h2 className="calendar-panel__title">
                                                {selectedDate.toLocaleDateString(undefined, {
                                                    weekday: 'long',
                                                    day: 'numeric',
                                                    month: 'long'
                                                })}
                                            </h2>

                                                    {selectedDayEvents.length > 0 ? (
                                                <div className="calendar-panel__list">
                                                    {selectedDayEvents.map((eventItem) => (
                                                        <article key={eventItem.id} className="calendar-panel__event">
                                                            <div className="calendar-panel__event-title">{eventItem.title}</div>
                                                            <div className="calendar-panel__event-time">{formatTimeRange(eventItem.startTime, eventItem.endTime, t)}</div>
                                                            {eventItem.description ? (
                                                                <div className="calendar-panel__event-description">{eventItem.description}</div>
                                                            ) : null}
                                                            <div className="calendar-panel__meta">
                                                                <span className="material-symbols-outlined">person</span>
                                                                {eventItem.creatorFirstName} {eventItem.creatorLastName}
                                                            </div>
                                                            {canCreateEvents && (
                                                                <div className="calendar-panel__actions">
                                                                    <button className="calendar-panel__btn calendar-panel__btn--edit" onClick={() => navigate(`/events/edit/${eventItem.id}`)} title={t('common.edit')}>
                                                                        <span className="material-symbols-outlined">edit</span>
                                                                    </button>
                                                                    <button className="calendar-panel__btn calendar-panel__btn--delete" onClick={() => setDeleteTarget(eventItem)} title={t('calendar.event_delete')}>
                                                                        <span className="material-symbols-outlined">delete</span>
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </article>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="calendar-panel__empty">{t('calendar.no_events_day')}</p>
                                            )}
                                        </div>

                                        <div className="calendar-panel">
                                            <h2 className="calendar-panel__title">{t('calendar.upcoming')}</h2>

                                            {error ? <p className="calendar-panel__error">{error}</p> : null}

                                            {!error && upcomingEvents.length > 0 ? (
                                                <div className="calendar-panel__list">
                                                    {upcomingEvents.map((eventItem) => (
                                                        <article key={eventItem.id} className="calendar-panel__event">
                                                            <div className="calendar-panel__event-title">{eventItem.title}</div>
                                                            <div className="calendar-panel__event-time">{formatTimeRange(eventItem.startTime, eventItem.endTime, t)}</div>
                                                            {eventItem.description ? (
                                                                <div className="calendar-panel__event-description">{eventItem.description}</div>
                                                            ) : null}
                                                        </article>
                                                    ))}
                                                </div>
                                            ) : null}

                                            {!error && upcomingEvents.length === 0 ? (
                                                <p className="calendar-panel__empty">{t('calendar.no_upcoming')}</p>
                                            ) : null}
                                        </div>
                                    </aside>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                <Footer />
            </div>

            <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title={t('calendar.event_delete')} size="small" handleBackdropClick={() => setDeleteTarget(null)}>
                {deleteTarget && (
                    <div className="delete-confirm">
                        <p>{t('calendar.event_delete_confirm')} <strong>"{deleteTarget.title}"</strong>?</p>
                        {deleting && <p className="delete-loading">{t('delete.loading')}</p>}
                        <div className="delete-actions">
                            <button className="btn-secondary" onClick={() => setDeleteTarget(null)} disabled={deleting}>{t('common.cancel')}</button>
                            <button className="btn-danger" onClick={async () => {
                                setDeleting(true);
                                try {
                                    await deleteEvent(deleteTarget.id);
                                    setEvents(prev => prev.filter(e => e.id !== deleteTarget.id));
                                    setDeleteTarget(null);
                                } catch (err) {
                                    alert(err.message || t('error.delete_event'));
                                } finally {
                                    setDeleting(false);
                                }
                            }} disabled={deleting}>
                                <span className="material-symbols-outlined">delete</span>
                                {t('common.delete')}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CalendarPage;