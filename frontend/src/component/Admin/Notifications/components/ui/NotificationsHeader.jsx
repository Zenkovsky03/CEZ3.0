import React from 'react';

function NotificationsHeader({ onCreateClick }) {
    return (
        <div className="admin-notifications__header">
            <div>
                <h1>Powiadomienia</h1>
                <p>Zarzadzaj komunikatami, alertami i przypomnieniami</p>
            </div>

            <button 
                type="button" 
                className="admin-notifications__create-btn"
                onClick={onCreateClick}
            >
                <span className="material-symbols-outlined">add</span>
                <span>Utworz powiadomienie</span>
            </button>
        </div>
    );
}

export default NotificationsHeader;
