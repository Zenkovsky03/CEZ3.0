import React, { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import Footer from '../Footer';
import Header from '../Header';
import './Dashboard.scss';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    const userName = user?.username || 'Użytkowniku';

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

                <Footer />
            </div>
        </div>
    );
};

export default Dashboard;
