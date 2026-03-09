import React from 'react';

const statusClass = {
    Wyslane: 'admin-notifications__status admin-notifications__status--sent',
    Zaplanowane: 'admin-notifications__status admin-notifications__status--scheduled',
    Draft: 'admin-notifications__status admin-notifications__status--draft',
    Nieudane: 'admin-notifications__status admin-notifications__status--failed'
};

const typeClass = {
    Info: 'admin-notifications__type-badge',
    Przypomnienie: 'admin-notifications__type-badge',
    Alert: 'admin-notifications__type-badge',
    Systemowe: 'admin-notifications__type-badge'
};

function NotificationChannels({ channels }) {
    const icons = [];

    if (channels.includes('Email')) icons.push('mail');
    if (channels.includes('Push')) icons.push('smartphone');
    if (channels.includes('In-app')) icons.push('notifications_active');

    return (
        <div className="admin-notifications__channels">
            {icons.map((icon) => (
                <span key={icon} className="material-symbols-outlined">
                    {icon}
                </span>
            ))}
        </div>
    );
}

function NotificationsTable({ items, selectedId, onSelect }) {
    return (
        <div className="admin-notifications__table-card">
            <table className="admin-notifications__table">
                <thead>
                    <tr>
                        <th>
                            <input type="checkbox" aria-label="Zaznacz wszystkie" />
                        </th>
                        <th>Tytul</th>
                        <th>Typ</th>
                        <th className="admin-notifications__th-center">Kanal</th>
                        <th>Status</th>
                        <th>Data</th>
                        <th className="admin-notifications__th-right">Akcje</th>
                    </tr>
                </thead>

                <tbody>
                    {items.map((item) => (
                        <tr
                            key={item.id}
                            className={item.id === selectedId ? 'admin-notifications__row--selected' : ''}
                            onClick={() => onSelect(item.id)}
                        >
                            <td>
                                <input
                                    type="checkbox"
                                    aria-label={`Zaznacz ${item.title}`}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </td>

                            <td>
                                <p className="admin-notifications__title">{item.title}</p>
                                <p className="admin-notifications__subtitle">{item.audience}</p>
                            </td>

                            <td>
                                <span className={typeClass[item.type]}>{item.type}</span>
                            </td>

                            <td className="admin-notifications__td-center">
                                <NotificationChannels channels={item.channels} />
                            </td>

                            <td>
                                <span className={statusClass[item.status]}>{item.status}</span>
                            </td>

                            <td className="admin-notifications__date">{item.dateLabel}</td>

                            <td className="admin-notifications__td-right">
                                <div className="admin-notifications__actions" onClick={(e) => e.stopPropagation()}>
                                    <button type="button" aria-label="Podglad">
                                        <span className="material-symbols-outlined">visibility</span>
                                    </button>
                                    <button type="button" aria-label="Edytuj">
                                        <span className="material-symbols-outlined">edit</span>
                                    </button>
                                    <button type="button" aria-label="Duplikuj">
                                        <span className="material-symbols-outlined">content_copy</span>
                                    </button>
                                    <button type="button" aria-label="Usun" className="is-danger">
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default NotificationsTable;
