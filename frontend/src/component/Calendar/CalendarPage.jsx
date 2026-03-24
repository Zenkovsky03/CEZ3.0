import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { getUserEvents } from '../../services/eventService';
import Footer from '../Footer';
import Header from '../Header';
import './CalendarPage.scss';

const WEEK_DAYS = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Niedz'];
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

const formatMonth = (value) => new Intl.DateTimeFormat('pl-PL', {
    month: 'long',
    year: 'numeric'
}).format(value);

const formatDateTime = (value) => new Intl.DateTimeFormat('pl-PL', {
    dateStyle: 'medium',
    timeStyle: 'short'
}).format(new Date(value));

const formatTimeRange = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
        return 'Brak poprawnej daty';
    }

    const sameDay = isSameDay(startDate, endDate);
    const timeFormatter = new Intl.DateTimeFormat('pl-PL', {
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

const CalendarPage = () => {
    const { user } = useContext(AuthContext);
    const [currentMonth, setCurrentMonth] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });
    const [selectedDate, setSelectedDate] = useState(() => new Date());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
                    setError(fetchError.message || 'Nie udało się pobrać wydarzeń.');
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
    }, []);

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
    const upcomingEvents = useMemo(() => {
        const now = new Date();
        return events
            .filter((eventItem) => eventItem.endDate >= now)
            .slice(0, 6);
    }, [events]);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-container">
                <main className="dashboard-main">
                    <Header variant="dashboard" />

                    <div className="dashboard-content">
                        <div className="calendar-page-shell">
                            <div className="calendar-page__hero">
                                <div>
                                    <h1 className="calendar-page__title">Kalendarz</h1>
                                    <p className="calendar-page__subtitle">Przeglądaj swoje wydarzenia i terminy w jednym miejscu.</p>
                                </div>
                                <div className="calendar-page__status">
                                    <span className="material-symbols-outlined">event</span>
                                    {events.length} zaplanowanych wydarzeń
                                </div>
                            </div>

                            {loading ? (
                                <div className="calendar-card calendar-page__loading">Ładowanie wydarzeń...</div>
                            ) : (
                                <div className="calendar-page">
                                    <section className="calendar-page__main">
                                        <div className="calendar-card">
                                            <div className="calendar-card__toolbar">
                                                <div>
                                                    <div className="calendar-card__month">{formatMonth(currentMonth)}</div>
                                                    <div className="calendar-card__toolbar-label">Kliknij dzień, aby zobaczyć szczegóły wydarzeń.</div>
                                                </div>
                                                <div className="calendar-card__toolbar-group">
                                                    <button
                                                        className="calendar-card__button"
                                                        type="button"
                                                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                                                        aria-label="Poprzedni miesiąc"
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
                                                        aria-label="Następny miesiąc"
                                                    >
                                                        <span className="material-symbols-outlined">chevron_right</span>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="calendar-grid">
                                                {WEEK_DAYS.map((weekDay) => (
                                                    <div key={weekDay} className="calendar-grid__weekday">{weekDay}</div>
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
                                                                    <span className="calendar-grid__more">+{dayEvents.length - MAX_EVENTS_PER_DAY} więcej</span>
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
                                                {selectedDate.toLocaleDateString('pl-PL', {
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
                                                            <div className="calendar-panel__event-time">{formatTimeRange(eventItem.startTime, eventItem.endTime)}</div>
                                                            {eventItem.description ? (
                                                                <div className="calendar-panel__event-description">{eventItem.description}</div>
                                                            ) : null}
                                                            <div className="calendar-panel__meta">
                                                                <span className="material-symbols-outlined">person</span>
                                                                {eventItem.creatorFirstName} {eventItem.creatorLastName}
                                                            </div>
                                                        </article>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="calendar-panel__empty">Brak wydarzeń dla wybranego dnia.</p>
                                            )}
                                        </div>

                                        <div className="calendar-panel">
                                            <h2 className="calendar-panel__title">Nadchodzące wydarzenia</h2>

                                            {error ? <p className="calendar-panel__error">{error}</p> : null}

                                            {!error && upcomingEvents.length > 0 ? (
                                                <div className="calendar-panel__list">
                                                    {upcomingEvents.map((eventItem) => (
                                                        <article key={eventItem.id} className="calendar-panel__event">
                                                            <div className="calendar-panel__event-title">{eventItem.title}</div>
                                                            <div className="calendar-panel__event-time">{formatTimeRange(eventItem.startTime, eventItem.endTime)}</div>
                                                            {eventItem.description ? (
                                                                <div className="calendar-panel__event-description">{eventItem.description}</div>
                                                            ) : null}
                                                        </article>
                                                    ))}
                                                </div>
                                            ) : null}

                                            {!error && upcomingEvents.length === 0 ? (
                                                <p className="calendar-panel__empty">Nie masz jeszcze żadnych nadchodzących wydarzeń.</p>
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
        </div>
    );
};

export default CalendarPage;