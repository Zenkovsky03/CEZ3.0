import React from 'react';
import '../../AdminCoursesPage.scss';

const CoursesSidebar = () => {
    return (
        <aside className="admin-courses__sidebar-card">
            <h3>
                <span className="material-symbols-outlined">bolt</span>
                <span>Szybkie akcje</span>
            </h3>

            <button type="button" className="admin-courses__quick-action">
                <span className="material-symbols-outlined">description</span>
                <span>Utwórz kurs z szablonu</span>
            </button>
            <button type="button" className="admin-courses__quick-action">
                <span className="material-symbols-outlined">group_add</span>
                <span>Przypisz wielu użytkowników</span>
            </button>
            <button type="button" className="admin-courses__quick-action">
                <span className="material-symbols-outlined">download</span>
                <span>Eksport CSV</span>
            </button>

            <div className="admin-courses__system-box">
                <h4>Wydajność systemowa</h4>

                <div className="admin-courses__system-item">
                    <div>
                        <span>Zajętość serwera</span>
                        <strong>62%</strong>
                    </div>
                    <div className="admin-courses__system-bar">
                        <div style={{ width: '62%' }} />
                    </div>
                </div>

                <div className="admin-courses__system-item">
                    <div>
                        <span>Limit użytkowników</span>
                        <strong>4,520 / 5k</strong>
                    </div>
                    <div className="admin-courses__system-bar">
                        <div className="admin-courses__system-bar--warn" style={{ width: '90%' }} />
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default CoursesSidebar;
