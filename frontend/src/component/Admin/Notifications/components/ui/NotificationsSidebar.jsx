import React from 'react';

function NotificationsSidebar({ notification }) {
    if (!notification) {
        return null;
    }

    return (
        <aside className="admin-notifications__sidebar">
            <section className="admin-notifications__preview-card">
                <div className="admin-notifications__preview-head">
                    <h3>Podglad szczegolowy</h3>
                    <span className="admin-notifications__status admin-notifications__status--scheduled">
                        {notification.status}
                    </span>
                </div>

                <div className="admin-notifications__preview-body">
                    <div>
                        <label>Tytul powiadomienia</label>
                        <p className="admin-notifications__preview-title">{notification.title}</p>
                    </div>

                    <div>
                        <label>Tresc wiadomosci</label>
                        <p className="admin-notifications__preview-message">{notification.message}</p>
                    </div>

                    <div className="admin-notifications__meta-grid">
                        <div>
                            <label>Kanaly</label>
                            <p>{notification.channels.join(', ')}</p>
                        </div>
                        <div>
                            <label>Odbiorcy</label>
                            <p>{notification.recipients}</p>
                        </div>
                    </div>

                    <div>
                        <label>Statystyki doreczenia</label>
                        <div className="admin-notifications__stats-grid">
                            <article>
                                <small>Dostarczono</small>
                                <strong>{notification.delivery.delivered}</strong>
                            </article>
                            <article>
                                <small>Otwarcia</small>
                                <strong>{notification.delivery.opened}</strong>
                            </article>
                            <article>
                                <small>Klikniecia</small>
                                <strong>{notification.delivery.clicked}</strong>
                            </article>
                            <article>
                                <small>Bledy</small>
                                <strong className="is-failed">{notification.delivery.failed}</strong>
                            </article>
                        </div>
                    </div>

                    <div>
                        <label>Historia zmian</label>
                        <ul className="admin-notifications__timeline">
                            {notification.history.map((item) => (
                                <li key={item.id}>
                                    <span className="admin-notifications__timeline-dot" />
                                    <div>
                                        <p>{item.title}</p>
                                        <small>{item.meta}</small>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="admin-notifications__preview-actions">
                    <button type="button" className="admin-notifications__btn admin-notifications__btn--light">Edytuj</button>
                    <button type="button" className="admin-notifications__btn admin-notifications__btn--primary">Wyslij ponownie</button>
                </div>
            </section>
        </aside>
    );
}

export default NotificationsSidebar;
