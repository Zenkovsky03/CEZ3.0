import { useTranslation } from 'react-i18next';
import './Landing.scss';
import Background from '../Background';
import Feature from '../Feature';

const Landing = () => {
    const { t } = useTranslation();
    return (
        <>
            <Background />
            <div className="page-wrapper">
                <main className="main-card-landing">
                    <div className="info-panel">
                        <div className="info-header">
                        <span className="material-symbols-outlined info-icon">school</span>
                        <h1 className="info-title">{t('app.name')}</h1>
                        </div>
                        <p className="info-subtitle">{t('Twoje centrum wiedzy i rozwoju. Odkryj nowoczesne narzędzia do nauki, które pomogą Ci osiągnąć sukces akademicki.')}</p>

                        <div className="features-list">
                            <Feature
                                icon="auto_stories"
                                title={t('course.materials')}
                                description={t('Dostęp do szerokiej bazy wykładów, notatek i zadań.')}
                            />
                            <Feature
                                icon="groups"
                                title={t('course.collaboration')}
                                description={t('Pracuj nad projektami ze swoimi kolegami w czasie rzeczywistym.')}
                            />
                            <Feature
                                icon="calendar_month"
                                title={t('Terminarz i powiadomienia')}
                                description={t('Śledź ważne terminy i nigdy nie przegap żadnego zadania.')}
                            />
                        </div>
                    </div>

                    <div className="action-panel">
                        <div className="action-content">
                        <h2 className="action-title">{t('Witamy!')}</h2>
                        <p className="action-subtitle">{t('auth.login_alt')}</p>
                        <div className="button-group">
                            <a className="button primary-button" href="/login">{t('auth.login')}</a>
                            <a className="button secondary-button" href="/register">{t('auth.register')}</a>
                        </div>
                        <p className="terms-text">{t('auth.terms_agree')} <a className="terms-link" href="#">{t('auth.terms')}</a> oraz <a className="terms-link" href="#">{t('auth.privacy')}</a>.</p>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Landing;