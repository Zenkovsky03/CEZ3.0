import React, { useEffect, useMemo, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../Layout/AdminLayout';
import { SearchContext } from '../../../../context/SearchContext';
import {
    NotificationsFilters,
    NotificationsHeader,
    NotificationsTable
} from '../components/ui';
import { getAnnouncements } from '../../../../services/adminApi';
import '../AdminNotificationsPageNew.scss';

function AdminNotificationsPage() {
    const navigate = useNavigate();
    const { searchQuery: query, setSearchQuery: setQuery } = useContext(SearchContext);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [type, setType] = useState('Wszystkie');
    const [channel, setChannel] = useState('Wszystkie');
    const [status, setStatus] = useState('Wszystkie');
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) {
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch announcements
                const announcementsData = await getAnnouncements({ pageNumber: 1, pageSize: 100 });
                const items = (announcementsData?.items || []).map((item) => ({
                    id: item.id,
                    title: item.title,
                    audience: `Utworzone przez ${item.creatorFirstName} ${item.creatorLastName}`,
                    type: 'Ogólne',
                    channels: ['Email'],
                    status: item.isActive ? 'Wysłane' : 'Draft',
                    dateLabel: new Date(item.createdAt).toLocaleDateString('pl-PL'),
                    message: item.content,
                    creatorEmail: item.creatorEmail
                }));
                setNotifications(items);

            } catch (err) {
                setError(err.message || 'Nie udało się pobrać danych');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();

        return notifications.filter((item) => {
            const queryMatch = !q || [item.title, item.audience, item.message].some((field) => field.toLowerCase().includes(q));
            const typeMatch = type === 'Wszystkie' || item.type === type;
            const statusMatch = status === 'Wszystkie' || item.status === status;
            const channelMatch = channel === 'Wszystkie' || item.channels.includes(channel);

            return queryMatch && typeMatch && statusMatch && channelMatch;
        });
    }, [query, type, channel, status, notifications]);

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

    const handleEditNotification = (notificationId) => {
        // TODO: Navigate to edit page when it's created
        console.log('Edit notification:', notificationId);
    };

    const handleCreateNotification = () => {
        navigate('/admin/notifications/create');
    };

    const handleDeleteNotification = async (notificationId) => {
        // TODO: Implement delete functionality when API is available
        console.log('Delete notification:', notificationId);
    };

    if (!token) {
        return null;
    }

    return (
        <AdminLayout onLogout={handleLogout}>
            <div className="admin-notifications">
                <section className="admin-notifications__main">
                    <NotificationsHeader onCreateClick={handleCreateNotification} />

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

                    {error && (
                        <div className="admin-users__error" style={{ marginBottom: '1rem' }}>
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                            Ładowanie powiadomień...
                        </div>
                    ) : (
                        <>
                            <NotificationsTable
                                items={filtered}
                                onEditNotification={handleEditNotification}
                                onDeleteNotification={handleDeleteNotification}
                            />

                            <div className="admin-notifications__pagination">
                                <p>Wyświetlanie 1-{filtered.length} z {filtered.length} wyników</p>
                                <div>
                                    <button type="button" disabled>
                                        <span className="material-symbols-outlined">chevron_left</span>
                                    </button>
                                    <button type="button" className="is-active">1</button>
                                    <button type="button" disabled>
                                        <span className="material-symbols-outlined">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </section>
            </div>
        </AdminLayout>
    );
}

export default AdminNotificationsPage;
