import React from 'react';

function ActivityChartCard({ summaryValue = 'Śr. 450/dzień', summaryLabel = 'Ostatnie 30 dni', summaryChange = '+12.5%' }) {
    return (
        <section className="admin-dashboard__panel admin-dashboard__panel--chart">
            <h2>Aktywność użytkowników w czasie</h2>
            <p className="admin-dashboard__metric">{summaryValue}</p>
            <p className="admin-dashboard__sub">
                {summaryLabel} <span>{summaryChange}</span>
            </p>
            <div className="admin-dashboard__chart" aria-hidden="true">
                <svg viewBox="0 0 472 150" preserveAspectRatio="none">
                    <path
                        d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H0V109Z"
                        fill="url(#chart-gradient)"
                    />
                    <path
                        d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
                        className="admin-dashboard__chart-line"
                    />
                    <defs>
                        <linearGradient id="chart-gradient" x1="236" x2="236" y1="1" y2="149" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#135bec" stopOpacity="0.2" />
                            <stop offset="1" stopColor="#135bec" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <div className="admin-dashboard__chart-labels">
                <span>Tydzień 1</span>
                <span>Tydzień 2</span>
                <span>Tydzień 3</span>
                <span>Tydzień 4</span>
            </div>
        </section>
    );
}

export default ActivityChartCard;
