import React from 'react';

function KpiCards({ stats }) {
    return (
        <div className="admin-dashboard__stats">
            {stats.map((item) => (
                <article key={item.id} className="admin-dashboard__stat-card">
                    <p className="admin-dashboard__stat-label">{item.label}</p>
                    <p className="admin-dashboard__stat-value">{item.value}</p>
                    <p
                        className={`admin-dashboard__stat-change ${
                            item.positive ? 'admin-dashboard__stat-change--up' : 'admin-dashboard__stat-change--down'
                        }`}
                    >
                        {item.change}
                    </p>
                </article>
            ))}
        </div>
    );
}

export default KpiCards;
