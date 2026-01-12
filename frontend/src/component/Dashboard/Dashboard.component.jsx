import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import Avatar from '../Avatar';
import Logo from '../Logo';
import './Dashboard.scss';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');

    const handleLogout = () => {
        logout();
    };

    const userName = user?.username || 'Użytkowniku';

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-container">
                <main className="dashboard-main">
                    {/* Header */}
                    <header className="dashboard-header">
                        <div className="header-top">
                            <Logo size="small" />
                            <div className="header-actions">
                                <div className="search-group">
                                    <button className="icon-button">
                                        <span className="material-symbols-outlined">search</span>
                                    </button>
                                    <input className="search-input" placeholder="Szukaj..." />
                                </div>
                                <button className="icon-button">
                                    <span className="material-symbols-outlined">notifications</span>
                                </button>
                                <button className="icon-button">
                                    <span className="material-symbols-outlined">chat_bubble</span>
                                </button>
                                <div className="user-dropdown">
                                    <Avatar
                                        firstName={user?.firstName}
                                        lastName={user?.lastName}
                                        username={user?.username}
                                        size="small"
                                    />
                                    <div className="dropdown-content">
                                        <Link to="/profile">Profil</Link>
                                        <Link to="/settings">Ustawienia</Link>
                                        <button onClick={handleLogout}>Wyloguj się</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <nav className="header-nav">
                            <Link
                                className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                                to="/"
                                onClick={() => setActiveTab('dashboard')}
                            >
                                <span className="material-symbols-outlined">dashboard</span>
                                Pulpit
                            </Link>
                            <Link
                                className={`nav-link ${activeTab === 'my-courses' ? 'active' : ''}`}
                                to="/my-courses"
                                onClick={() => setActiveTab('my-courses')}
                            >
                                <span className="material-symbols-outlined">book</span>
                                Moje kursy
                            </Link>
                            <Link
                                className={`nav-link ${activeTab === 'courses' ? 'active' : ''}`}
                                to="/courses"
                                onClick={() => setActiveTab('courses')}
                            >
                                <span className="material-symbols-outlined">library_books</span>
                                Wszystkie kursy
                            </Link>
                            <Link
                                className={`nav-link ${activeTab === 'calendar' ? 'active' : ''}`}
                                to="/calendar"
                                onClick={() => setActiveTab('calendar')}
                            >
                                <span className="material-symbols-outlined">calendar_today</span>
                                Kalendarz
                            </Link>
                            <Link
                                className={`nav-link ${activeTab === 'grades' ? 'active' : ''}`}
                                to="/grades"
                                onClick={() => setActiveTab('grades')}
                            >
                                <span className="material-symbols-outlined">school</span>
                                Oceny
                            </Link>
                            <Link
                                className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                                to="/settings"
                                onClick={() => setActiveTab('settings')}
                            >
                                <span className="material-symbols-outlined">settings</span>
                                Ustawienia
                            </Link>
                        </nav>
                    </header>

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
                                    <div className="event-item">
                                        <div className="event-icon primary">
                                            <span className="material-symbols-outlined">assignment</span>
                                        </div>
                                        <div className="event-info">
                                            <p className="event-title">Oddanie projektu końcowego</p>
                                            <p className="event-details">UX/UI Design - Termin: 25.10.2024, 23:59</p>
                                        </div>
                                    </div>
                                    <div className="event-item">
                                        <div className="event-icon orange">
                                            <span className="material-symbols-outlined">quiz</span>
                                        </div>
                                        <div className="event-info">
                                            <p className="event-title">Egzamin końcowy</p>
                                            <p className="event-details">Wprowadzenie do Pythona - Termin: 28.10.2024, 12:00</p>
                                        </div>
                                    </div>
                                    <div className="event-item">
                                        <div className="event-icon purple">
                                            <span className="material-symbols-outlined">task</span>
                                        </div>
                                        <div className="event-info">
                                            <p className="event-title">Zadanie domowe nr 5</p>
                                            <p className="event-details">Wprowadzenie do Pythona - Termin: 02.11.2024, 23:59</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Announcements Section */}
                            <section className="dashboard-section">
                                <h2 className="section-title">Ostatnie ogłoszenia</h2>
                                <div className="announcements-card">
                                    <div className="announcement-item">
                                        <p className="announcement-date">18.10.2024</p>
                                        <p className="announcement-title">Zmiana terminu egzaminu z UX/UI Design</p>
                                        <p className="announcement-text">Uwaga! Egzamin końcowy został przeniesiony na nowy termin...</p>
                                    </div>
                                    <div className="announcement-item">
                                        <p className="announcement-date">15.10.2024</p>
                                        <p className="announcement-title">Dodatkowe materiały do kursu Python</p>
                                        <p className="announcement-text">W sekcji "Materiały" pojawiły się nowe zadania i przykłady...</p>
                                    </div>
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

                <footer className="dashboard-footer">
                    <div className="footer-links">
                        <Link to="/terms">Regulamin</Link>
                        <span>·</span>
                        <Link to="/privacy">Polityka Prywatności</Link>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Dashboard;
