import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../Layout/AdminLayout';
import { ActivityChartCard, KpiCards, TopCoursesCard } from './components/ui';
import './AdminDashboardPage.scss';

const stats = [
    { id: 'users', label: 'Aktywni Użytkownicy', value: '1,240', change: '+2.5%', positive: true },
    { id: 'registrations', label: 'Nowe Rejestracje (30d)', value: '85', change: '+15%', positive: true },
    { id: 'courses', label: 'Aktywne Kursy', value: '58', change: '+5%', positive: true },
    { id: 'completed', label: 'Ukończone Kursy (30d)', value: '112', change: '-8%', positive: false }
];

const topCourses = [
    { name: 'Podstawy Programowania', score: '1.2k', progress: 90 },
    { name: 'Marketing Cyfrowy', score: '980', progress: 75 },
    { name: 'Analiza Danych w Python', score: '760', progress: 60 },
    { name: 'Zarządzanie Projektami', score: '550', progress: 45 },
    { name: 'Wprowadzenie do AI', score: '410', progress: 30 }
];

function AdminDashboardPage() {
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    const handleLogout = () => {
        setToken('');
        localStorage.removeItem('token');
        navigate('/admin');
    };

    if (!token) {
        return null;
    }

    return (
        <AdminLayout onLogout={handleLogout}>
            <div className="admin-dashboard">
                <div className="admin-dashboard__header">
                    <div>
                        <h1>Dashboard</h1>
                        <p>Witaj ponownie! Oto przegląd aktywności na platformie.</p>
                    </div>
                </div>

                <KpiCards stats={stats} />

                <div className="admin-dashboard__grid">
                    <ActivityChartCard />
                    <TopCoursesCard courses={topCourses} />
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminDashboardPage;
