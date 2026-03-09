import React from 'react';

function NotificationsFilters({
    query,
    type,
    channel,
    status,
    onQueryChange,
    onTypeChange,
    onChannelChange,
    onStatusChange,
    onClearFilters
}) {
    return (
        <div className="admin-notifications__filters">
            <div className="admin-notifications__search">
                <span className="material-symbols-outlined">search</span>
                <input
                    type="text"
                    placeholder="Szukaj powiadomienia..."
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                />
            </div>

            <select value={type} onChange={(e) => onTypeChange(e.target.value)}>
                <option value="Wszystkie">Typ: Wszystkie</option>
                <option value="Info">Info</option>
                <option value="Przypomnienie">Przypomnienie</option>
                <option value="Alert">Alert</option>
                <option value="Systemowe">Systemowe</option>
            </select>

            <select value={channel} onChange={(e) => onChannelChange(e.target.value)}>
                <option value="Wszystkie">Kanal: Wszystkie</option>
                <option value="In-app">In-app</option>
                <option value="Email">Email</option>
                <option value="Push">Push</option>
            </select>

            <select value={status} onChange={(e) => onStatusChange(e.target.value)}>
                <option value="Wszystkie">Status: Wszystkie</option>
                <option value="Wyslane">Wyslane</option>
                <option value="Zaplanowane">Zaplanowane</option>
                <option value="Draft">Draft</option>
                <option value="Nieudane">Nieudane</option>
            </select>

            <button type="button" className="admin-notifications__clear-btn" onClick={onClearFilters}>
                Wyczysc filtry
            </button>
        </div>
    );
}

export default NotificationsFilters;
