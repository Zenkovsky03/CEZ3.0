import './Landing.scss';
import Background from '../Background';
import Feature from '../Feature';

const Landing = () => {
   return (
        <>
            <Background />
            <div className="page-wrapper">
                <main className="main-card-landing">
                    <div className="info-panel">
                        <div className="info-header">
                        <span className="material-symbols-outlined info-icon">school</span>
                        <h1 className="info-title">CEZ 3.0</h1>
                        </div>
                        <p className="info-subtitle">Twoje centrum wiedzy i rozwoju. Odkryj nowoczesne narzędzia do nauki, które pomogą Ci
                        osiągnąć sukces akademicki.</p>

                        <div className="features-list">
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

                    <div className="action-panel">
                        <div className="action-content">
                        <h2 className="action-title">Witamy!</h2>
                        <p className="action-subtitle">Zaloguj się, aby kontynuować naukę, bądź zarejestruj się, żeby rozpocząć.</p>
                        <div className="button-group">
                            <a className="button primary-button" href="/login">Zaloguj się</a>
                            <a className="button secondary-button" href="/register">Zarejestruj się</a>
                        </div>
                        <p className="terms-text">Kontynuując, akceptujesz nasz <a className="terms-link" href="#">Regulamin</a> oraz <a className="terms-link" href="#">Politykę Prywatności</a>.</p>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Landing;