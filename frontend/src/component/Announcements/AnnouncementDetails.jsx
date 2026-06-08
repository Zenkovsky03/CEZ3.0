import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import Header from '../Header';
import Spinner from '../Spinner';
import Modal from '../Modal';
import { getAnnouncementById, deleteAnnouncement } from '../../services/announcementService';
import './Announcements.scss';

const AnnouncementDetails = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [announcement, setAnnouncement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                const data = await getAnnouncementById(id);
                if (!mounted) return;
                setAnnouncement(data);
            } catch (err) {
                if (!mounted) return;
                setError(err.message || t('error.load_announcement'));
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();
        return () => { mounted = false; };
    }, [id, t]);

    if (loading) return (
        <div className="page-wrapper-announcements">
            <Header variant="dashboard" />
            <div className="main-content narrow"><Spinner size="lg" /></div>
        </div>
    );

    if (error) return (
        <div className="page-wrapper-announcements">
            <Header variant="dashboard" />
            <div className="main-content narrow"><p className="error-message">{error}</p></div>
        </div>
    );

    if (!announcement) return null;

    const canManageAnnouncements = user?.role === 'Admin' || user?.role === 'Teacher';

    return (
        <div className="page-wrapper-announcements">
            <Header variant="dashboard" />
            <div className="main-content narrow">
                <Link to="/courses" className="back-link">
                    <span className="material-symbols-outlined">arrow_back</span>
                    {t('nav.courses')}
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
                                        {new Intl.DateTimeFormat(undefined, { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(announcement.createdAt))}
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

                    {canManageAnnouncements && (
                        <div className="ann-actions">
                            <button className="ann-action-btn ann-action-btn--edit" onClick={() => navigate(`/announcements/${announcement.id}/edit`)}>
                                <span className="material-symbols-outlined">edit</span>
                                {t('common.edit')}
                            </button>
                            <button className="ann-action-btn ann-action-btn--delete" onClick={() => setDeleteTarget(announcement)}>
                                <span className="material-symbols-outlined">delete</span>
                                {t('common.delete')}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title={t('announcement.delete')} size="small" handleBackdropClick={() => setDeleteTarget(null)}>
                {deleteTarget && (
                    <div className="ann-delete-confirm">
                        <p>{t('announcement.delete_confirm')} <strong>"{deleteTarget.title}"</strong>?</p>
                        {deleting && <p className="delete-loading">{t('delete.loading')}</p>}
                        <div className="ann-delete-actions">
                            <button className="btn-secondary" onClick={() => setDeleteTarget(null)} disabled={deleting}>{t('common.cancel')}</button>
                            <button className="btn-danger" onClick={async () => {
                                setDeleting(true);
                                try {
                                    await deleteAnnouncement(deleteTarget.id);
                                    navigate('/courses');
                                } catch (err) {
                                    alert(err.message || t('error.delete_announcement'));
                                } finally {
                                    setDeleting(false);
                                }
                            }} disabled={deleting}>
                                <span className="material-symbols-outlined">delete</span>
                                {t('common.delete')}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AnnouncementDetails;
