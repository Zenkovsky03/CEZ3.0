import React from 'react';
import './LandingPage.css';

const Background = () => (
    <div className="background-container">
        <img
            alt="Abstract technology background"
            className="background-image"
            src="landing-page-background.png"
        />
        <div className="background-gradient"></div>
    </div>
);

const Feature = ({ icon, title, description }) => (
    <div className="feature-item">
        <span className="material-symbols-outlined feature-icon feature-icon">{icon}</span>
        <div>
            <h3 className="feature-title">{title}</h3>
            <p className="feature-description">{description}</p>
        </div>
    </div>
);

const LandingPage = () => {
   return (
        <>
            <Background />
            <div className="page-wrapper">
                <main class="main-card-landing">
                    <div class="info-panel">
                        <div class="info-header">
                        <span class="material-symbols-outlined info-icon">school</span>
                        <h1 class="info-title">CEZ 3.0</h1>
                        </div>
                        <p class="info-subtitle">Twoje centrum wiedzy i rozwoju. Odkryj nowoczesne narzędzia do nauki, które pomogą Ci
                        osiągnąć sukces akademicki.</p>

                        <div class="features-list">
                            <Feature
                                icon="auto_stories"
                                title="Materiały dydaktyczne"
                                description="Dostęp do szerokiej bazy wykładów, notatek i zadań."
                            />
                            <Feature
                                icon="groups"
                                title="Współpraca w grupach"
                                description="Pracuj nad projektami ze swoimi kolegami w czasie rzeczywistym."
                            />
                            <Feature
                                icon="calendar_month"
                                title="Terminarz i powiadomienia"
                                description="Śledź ważne terminy i nigdy nie przegap żadnego zadania."
                            />
                        </div>
                    </div>

                   <div class="action-panel">
                        <div class="action-content">
                        <h2 class="action-title">Witamy!</h2>
                        <p class="action-subtitle">Zaloguj się, aby kontynuować naukę, bądź zarejestruj się, żeby rozpocząć.</p>
                        <div class="button-group">
                            <a class="button primary-button" href="/login">Zaloguj się</a>
                            <a class="button secondary-button" href="/register">Zarejestruj się</a>
                        </div>
                        <p class="terms-text">Kontynuując, akceptujesz nasz <a class="terms-link" href="#">Regulamin</a> oraz <a class="terms-link" href="#">Politykę Prywatności</a>.</p>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default LandingPage;