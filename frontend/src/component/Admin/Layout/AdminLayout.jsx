import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminLayout.scss';
import AuthContext from '../../../context/AuthContext';

const AdminLayout = ({ children, onLogout }) => {
    const location = useLocation();
    const { user } = useContext(AuthContext);

    const displayName = user
        ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Admin'
        : 'Admin';
    const displayEmail = user?.email || '';

    const navItems = [
        { name: 'Użytkownicy', icon: 'group', path: '/admin/users' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-layout__sidebar">
                {/* Logo */}
                <div className="admin-layout__logo">
                    <div>
                        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z" fill="currentColor"/>
                        </svg>
                    </div>
                    <h1>CEZ 3.0</h1>
                </div>

                {/* Navigation */}
                <nav className="admin-layout__nav">
                    <div className="admin-layout__nav-items">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`admin-layout__nav-item ${
                                    isActive(item.path) ? 'admin-layout__nav-item--active' : ''
                                }`}
                            >
                                <span className="material-symbols-outlined">
                                    {item.icon}
                                </span>
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </div>
                </nav>

                {/* User Profile */}
                <div className="admin-layout__user-section">
                    <div className="admin-layout__user-profile">
                        <div className="admin-layout__user-avatar">
                            {displayName[0] || 'A'}
                        </div>
                        <div className="admin-layout__user-info">
                            <p className="admin-layout__user-info-name">{displayName}</p>
                            <p className="admin-layout__user-info-email">{displayEmail}</p>
                        </div>
                    </div>
                    <div className="admin-layout__user-actions">
                        <button className="admin-layout__user-btn admin-layout__user-btn--settings">
                            <span className="material-symbols-outlined">settings</span>
                            <span>Ustawienia</span>
                        </button>
                        <button 
                            onClick={onLogout}
                            className="admin-layout__user-btn admin-layout__user-btn--logout"
                        >
                            <span className="material-symbols-outlined">logout</span>
                            <span>Wyloguj</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-layout__main">
                {/* Top Bar */}
                <header className="admin-layout__header">
                    <div className="admin-layout__header-content">
                        <h2>Panel Administracyjny</h2>
                        <div className="admin-layout__header-actions">
                            {/* Search */}
                            <div className="admin-layout__search">
                                <input
                                    type="text"
                                    placeholder="Szukaj użytkownika, kursu..."
                                />
                                <span className="material-symbols-outlined">
                                    search
                                </span>
                            </div>
                            
                            {/* Buttons */}
                            <button className="admin-layout__header-btn">
                                <span className="material-symbols-outlined">notifications</span>
                            </button>
                            <button className="admin-layout__header-btn">
                                <span className="material-symbols-outlined">help</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="admin-layout__content">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
