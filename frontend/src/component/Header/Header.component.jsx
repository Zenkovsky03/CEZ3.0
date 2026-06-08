import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthContext from '../../context/AuthContext';
import Avatar from '../Avatar';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import Logo from '../Logo';

const navigationItems = [
    { key: 'dashboard', labelKey: 'nav.dashboard', to: '/', icon: 'dashboard', exact: true, roles: null },
    { key: 'courses', labelKey: 'nav.courses', to: '/courses', icon: 'library_books', roles: null },
    { key: 'assignments', labelKey: 'nav.assignments', to: '/assignments', icon: 'assignment', roles: null },
    { key: 'grades', labelKey: 'nav.grades', to: '/grades', icon: 'grade', roles: null },
    { key: 'calendar', labelKey: 'nav.calendar', to: '/calendar', icon: 'calendar_today', roles: null },
    { key: 'messages', labelKey: 'nav.messages', to: '/messages', icon: 'chat_bubble', roles: null },
    { key: 'forum', labelKey: 'nav.forum', to: '/forum', icon: 'forum', roles: null },
    { key: 'gradebook', labelKey: 'nav.gradebook', to: '/grades/course', icon: 'book', roles: ['Teacher', 'Admin'] }
];

const isActiveLink = (pathname, item) => {
    if (item.exact) {
        return pathname === item.to;
    }

    return pathname === item.to || pathname.startsWith(`${item.to}/`);
};

const Header = ({ variant = 'simple' }) => {
    const location = useLocation();
    const { user, logout } = useContext(AuthContext);
    const { t } = useTranslation();

    const visibleItems = navigationItems.filter(item => {
        if (!item.roles) return true;
        return user?.role && item.roles.includes(user.role);
    });

    if (variant === 'dashboard') {
        return (
            <header className="dashboard-header">
                <div className="header-top">
                    <Logo size="small" />
                    <div className="header-actions">
                        <div className="search-group">
                            <button className="icon-button" type="button" aria-label={t('header.search_aria')}>
                                <span className="material-symbols-outlined">search</span>
                            </button>
                            <input className="search-input" placeholder={t('header.search')} aria-label={t('header.search_aria')} />
                        </div>
                        <button className="icon-button" type="button" aria-label={t('header.notifications_aria')}>
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <button className="icon-button" type="button" aria-label={t('header.messages_aria')}>
                            <span className="material-symbols-outlined">chat_bubble</span>
                        </button>
                        <LanguageSwitcher />
                        <div className="user-dropdown">
                            <Avatar
                                firstName={user?.firstName}
                                lastName={user?.lastName}
                                username={user?.username}
                                size="small"
                            />
                            <div className="dropdown-content">
                                <button type="button" onClick={logout}>{t('header.logout')}</button>
                            </div>
                        </div>
                    </div>
                </div>
                <nav className="header-nav">
                    {visibleItems.map((item) => (
                        <Link
                            key={item.key}
                            className={`nav-link ${isActiveLink(location.pathname, item) ? 'active' : ''}`}
                            to={item.to}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            {t(item.labelKey)}
                        </Link>
                    ))}
                </nav>
            </header>
        );
    }

    return (
        <header className="top-navbar">
            <Logo />
        </header>
    );
};

export default Header;