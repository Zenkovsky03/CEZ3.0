import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../Header';
import { getAnnouncementById } from '../../services/announcementService';
import './Announcements.scss';

const AnnouncementDetails = () => {
    const { id } = useParams();
    const [announcement, setAnnouncement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                const data = await getAnnouncementById(id);
                if (!mounted) return;
                setAnnouncement(data);
            } catch (err) {
                if (!mounted) return;
                setError(err.message || 'Nie udało się pobrać ogłoszenia');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();
        return () => { mounted = false; };
    }, [id]);

    if (loading) return (
        <div className="page-wrapper-announcements">
            <Header variant="dashboard" />
            <div className="main-content narrow"><p>Ładowanie ogłoszenia...</p></div>
        </div>
    );

    if (error) return (
        <div className="page-wrapper-announcements">
            <Header variant="dashboard" />
            <div className="main-content narrow"><p className="error-message">{error}</p></div>
        </div>
    );

    if (!announcement) return null;

    return (
        <div className="page-wrapper-announcements">
            <Header variant="dashboard" />
            <div className="main-content narrow">
                <Link to="/courses" className="back-link">
                    <span className="material-symbols-outlined">arrow_back</span>
                    Kursy
                </Link>

                <div className="announcement-detail-card">
                    {announcement.courseName && (
                        <div className="ann-course-tag">
                            <span className="material-symbols-outlined">school</span>
                            {announcement.courseName}
                        </div>
                    )}

                    <h1 className="ann-detail-title">{announcement.title}</h1>

                    {announcement.authorName && (
                        <div className="ann-author-row">
                            <div className="ann-avatar">
                                {(announcement.authorName?.[0] || 'A').toUpperCase()}
                            </div>
                            <div>
                                <span className="ann-author-name">{announcement.authorName}</span>
                                {announcement.createdAt && (
                                    <span className="ann-post-date">
                                        {' · '}
                                        {new Intl.DateTimeFormat('pl-PL', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(announcement.createdAt))}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="ann-divider" />

                    <div className="ann-body">
                        {(announcement.content || '').split('\n\n').map((para, i) => (
                            <p key={i}>{para}</p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementDetails;
