import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import Avatar from '../Avatar';
import Logo from '../Logo';

const navigationItems = [
    { key: 'dashboard', label: 'Pulpit', to: '/', icon: 'dashboard', exact: true, roles: null },
    { key: 'courses', label: 'Wszystkie kursy', to: '/courses', icon: 'library_books', roles: null },
    { key: 'assignments', label: 'Zadania', to: '/assignments', icon: 'assignment', roles: null },
    { key: 'calendar', label: 'Kalendarz', to: '/calendar', icon: 'calendar_today', roles: null },
    { key: 'messages', label: 'Wiadomości', to: '/messages', icon: 'chat_bubble', roles: null },
    { key: 'forum', label: 'Forum', to: '/forum', icon: 'forum', roles: null }
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
                            <button className="icon-button" type="button" aria-label="Szukaj">
                                <span className="material-symbols-outlined">search</span>
                            </button>
                            <input className="search-input" placeholder="Szukaj..." aria-label="Szukaj" />
                        </div>
                        <button className="icon-button" type="button" aria-label="Powiadomienia">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <button className="icon-button" type="button" aria-label="Wiadomości">
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
                                <button type="button" onClick={logout}>Wyloguj się</button>
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
                            {item.label}
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