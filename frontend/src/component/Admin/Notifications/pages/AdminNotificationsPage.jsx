import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../Layout/AdminLayout';
import {
    NotificationsFilters,
    NotificationsHeader,
    NotificationsSidebar,
    NotificationsTable
} from '../components/ui';
import '../AdminNotificationsPageNew.scss';

const notifications = [
    {
        id: 'n1',
        title: 'Nowy kurs: Matematyka Dyskretna',
        audience: 'Do wszystkich studentow IT',
        type: 'Info',
        channels: ['Email', 'Push'],
        status: 'Wyslane',
        dateLabel: 'Dzisiaj, 10:45',
        recipients: '312 studentow',
        message: 'Uruchomilismy nowy kurs Matematyka Dyskretna. Zapisy sa juz otwarte w panelu kursow.',
        delivery: {
            delivered: '312',
            opened: '228',
            clicked: '109',
            failed: '0'
        },
        history: [
            { id: 'h1', title: 'Utworzono powiadomienie', meta: 'Jan Kowalski - Dzisiaj, 09:20' },
            { id: 'h2', title: 'Wyslano komunikat', meta: 'System - Dzisiaj, 10:45' }
        ]
    },
    {
        id: 'n2',
        title: 'Przypomnienie o egzaminie',
        audience: 'Grupa A2, B3',
        type: 'Przypomnienie',
        channels: ['In-app'],
        status: 'Zaplanowane',
        dateLabel: 'Jutro, 08:00',
        recipients: '248 studentow',
        message: 'Przypominamy o egzaminie z przedmiotu Bazy Danych. Start: jutro o 9:00, sala 204.',
        delivery: {
            delivered: '--',
            opened: '--',
            clicked: '--',
            failed: '0'
        },
        history: [
            { id: 'h3', title: 'Utworzono powiadomienie', meta: 'Jan Kowalski - Dzisiaj, 09:15' },
            { id: 'h4', title: 'Zaplanowano wysylke', meta: 'Jan Kowalski - Dzisiaj, 09:17' }
        ]
    },
    {
        id: 'n3',
        title: 'Przerwa techniczna systemu',
        audience: 'Wszyscy uzytkownicy',
        type: 'Systemowe',
        channels: ['Email'],
        status: 'Draft',
        dateLabel: '12 Paz 2023',
        recipients: 'Wszyscy uzytkownicy',
        message: 'Zaplanowana przerwa techniczna systemu: sobota 22:00-23:30. Funkcje panelu beda chwilowo niedostepne.',
        delivery: {
            delivered: '--',
            opened: '--',
            clicked: '--',
            failed: '0'
        },
        history: [
            { id: 'h5', title: 'Utworzono draft', meta: 'Katarzyna Wojcik - 11 Paz 2023, 13:05' }
        ]
    },
    {
        id: 'n4',
        title: 'Alert: Proba nieautoryzowanego dostepu',
        audience: 'Admin Staff',
        type: 'Alert',
        channels: ['Email', 'Push'],
        status: 'Nieudane',
        dateLabel: '10 Paz 2023',
        recipients: '8 administratorow',
        message: 'System wykryl probe nieautoryzowanego dostepu do panelu administracyjnego z adresu IP 192.168.10.8.',
        delivery: {
            delivered: '6',
            opened: '4',
            clicked: '1',
            failed: '2'
        },
        history: [
            { id: 'h6', title: 'Utworzono alert', meta: 'System - 10 Paz 2023, 07:42' },
            { id: 'h7', title: 'Blad wysylki (2 odbiorcow)', meta: 'System - 10 Paz 2023, 07:43' }
        ]
    }
];

function AdminNotificationsPage() {
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [query, setQuery] = useState('');
    const [type, setType] = useState('Wszystkie');
    const [channel, setChannel] = useState('Wszystkie');
    const [status, setStatus] = useState('Wszystkie');
    const [selectedId, setSelectedId] = useState('n2');

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();

        return notifications.filter((item) => {
            const queryMatch = !q
                || [item.title, item.audience, item.message].some((field) => field.toLowerCase().includes(q));
            const typeMatch = type === 'Wszystkie' || item.type === type;
            const statusMatch = status === 'Wszystkie' || item.status === status;
            const channelMatch = channel === 'Wszystkie' || item.channels.includes(channel);

            return queryMatch && typeMatch && statusMatch && channelMatch;
        });
    }, [query, type, channel, status]);

    const selected = filtered.find((item) => item.id === selectedId) || filtered[0] || null;

    const handleLogout = () => {
        setToken('');
        localStorage.removeItem('token');
        navigate('/admin');
    };

    const handleClearFilters = () => {
        setQuery('');
        setType('Wszystkie');
        setChannel('Wszystkie');
        setStatus('Wszystkie');
    };

    if (!token) {
        return null;
    }

    return (
        <AdminLayout onLogout={handleLogout}>
            <div className="admin-notifications">
                <div className="admin-notifications__layout">
                    <section className="admin-notifications__main">
                        <NotificationsHeader />

                        <NotificationsFilters
                            query={query}
                            type={type}
                            channel={channel}
                            status={status}
                            onQueryChange={setQuery}
                            onTypeChange={setType}
                            onChannelChange={setChannel}
                            onStatusChange={setStatus}
                            onClearFilters={handleClearFilters}
                        />

                        <NotificationsTable
                            items={filtered}
                            selectedId={selectedId}
                            onSelect={setSelectedId}
                        />

                        <div className="admin-notifications__pagination">
                            <p>Wyswietlanie 1-10 z {filtered.length} wynikow</p>
                            <div>
                                <button type="button" disabled>
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                <button type="button" className="is-active">1</button>
                                <button type="button">2</button>
                                <button type="button">3</button>
                                <span>...</span>
                                <button type="button">13</button>
                                <button type="button">
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </section>

                    <NotificationsSidebar notification={selected} />
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminNotificationsPage;
