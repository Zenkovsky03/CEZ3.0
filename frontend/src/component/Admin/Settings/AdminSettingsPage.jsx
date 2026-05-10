import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../Layout/AdminLayout';
import './AdminSettingsPage.scss';

function AdminSettingsPage() {
    const navigate = useNavigate();
    const [settings, setSettings] = useState({
        academicYear: '2025/2026',
        currentSemester: 'Semestr letni',
        minStudentsPerCourse: 3,
        maxStudentsPerCourse: 40,
        quizTimeLimit: 60,
        assignmentDeadlineDays: 14,
        passingGrade: 3.0,
        enableAutoArchive: true,
        archiveAfterDays: 365,
        emailNotifications: true,
        gradeNotifications: true,
        attendanceTracking: true,
        allowLateSubmissions: true,
        lateSubmissionPenalty: 10,
    });

    const [changes, setChanges] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setChanges(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleSave = () => {
        setSettings(prev => ({
            ...prev,
            ...changes
        }));
        setChanges({});
        alert('Ustawienia akademickie zostały zapisane');
    };

    const handleCancel = () => {
        setChanges({});
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/admin');
    };

    return (
        <AdminLayout onLogout={handleLogout}>
            <div className="admin-settings">
                <div className="admin-settings__header">
                    <button 
                        className="admin-settings__back-btn"
                        onClick={() => navigate(-1)}
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1>Ustawienia</h1>
                </div>

                <div className="admin-settings__container">
                    {/* Academic Calendar */}
                    <section className="admin-settings__section">
                        <h2 className="admin-settings__section-title">Kalendarz akademicki</h2>
                        
                        <div className="admin-settings__form-group">
                            <label className="admin-settings__label">Rok akademicki</label>
                            <input 
                                type="text"
                                name="academicYear"
                                className="admin-settings__input"
                                value={changes.academicYear !== undefined ? changes.academicYear : settings.academicYear}
                                onChange={handleChange}
                                placeholder="2025/2026"
                            />
                        </div>

                        <div className="admin-settings__form-group">
                            <label className="admin-settings__label">Aktualny semestr</label>
                            <select 
                                name="currentSemester"
                                className="admin-settings__select"
                                value={changes.currentSemester !== undefined ? changes.currentSemester : settings.currentSemester}
                                onChange={handleChange}
                            >
                                <option value="Semestr zimowy">Semestr zimowy</option>
                                <option value="Semestr letni">Semestr letni</option>
                            </select>
                        </div>
                    </section>

                    {/* Course Settings */}
                    <section className="admin-settings__section">
                        <h2 className="admin-settings__section-title">Ustawienia kursów</h2>
                        
                        <div className="admin-settings__form-group">
                            <label className="admin-settings__label">Minimalna liczba studentów w kursie</label>
                            <input 
                                type="number"
                                name="minStudentsPerCourse"
                                className="admin-settings__input"
                                value={changes.minStudentsPerCourse !== undefined ? changes.minStudentsPerCourse : settings.minStudentsPerCourse}
                                onChange={handleChange}
                                min="1"
                            />
                        </div>

                        <div className="admin-settings__form-group">
                            <label className="admin-settings__label">Maksymalna liczba studentów w kursie</label>
                            <input 
                                type="number"
                                name="maxStudentsPerCourse"
                                className="admin-settings__input"
                                value={changes.maxStudentsPerCourse !== undefined ? changes.maxStudentsPerCourse : settings.maxStudentsPerCourse}
                                onChange={handleChange}
                                min="1"
                            />
                        </div>
                    </section>

                    {/* Quiz & Assignments */}
                    <section className="admin-settings__section">
                        <h2 className="admin-settings__section-title">Quizy i zadania</h2>
                        
                        <div className="admin-settings__form-group">
                            <label className="admin-settings__label">Domyślny limit czasu dla quizów (minuty)</label>
                            <input 
                                type="number"
                                name="quizTimeLimit"
                                className="admin-settings__input"
                                value={changes.quizTimeLimit !== undefined ? changes.quizTimeLimit : settings.quizTimeLimit}
                                onChange={handleChange}
                                min="5"
                                max="300"
                            />
                        </div>

                        <div className="admin-settings__form-group">
                            <label className="admin-settings__label">Deadline dla zadań (dni)</label>
                            <input 
                                type="number"
                                name="assignmentDeadlineDays"
                                className="admin-settings__input"
                                value={changes.assignmentDeadlineDays !== undefined ? changes.assignmentDeadlineDays : settings.assignmentDeadlineDays}
                                onChange={handleChange}
                                min="1"
                                max="60"
                            />
                        </div>

                        <div className="admin-settings__form-group">
                            <label className="admin-settings__label">Ocena zaliczająca kurs</label>
                            <input 
                                type="number"
                                name="passingGrade"
                                className="admin-settings__input"
                                value={changes.passingGrade !== undefined ? changes.passingGrade : settings.passingGrade}
                                onChange={handleChange}
                                min="2.0"
                                max="5.0"
                                step="0.5"
                            />
                        </div>

                        <div className="admin-settings__form-group admin-settings__form-group--checkbox">
                            <label className="admin-settings__checkbox-label">
                                <input 
                                    type="checkbox"
                                    name="allowLateSubmissions"
                                    className="admin-settings__checkbox"
                                    checked={changes.allowLateSubmissions !== undefined ? changes.allowLateSubmissions : settings.allowLateSubmissions}
                                    onChange={handleChange}
                                />
                                <span>Zezwól na opóźnione oddawanie zadań</span>
                            </label>
                        </div>

                        <div className="admin-settings__form-group">
                            <label className="admin-settings__label">Kara za opóźnienie (%)</label>
                            <input 
                                type="number"
                                name="lateSubmissionPenalty"
                                className="admin-settings__input"
                                value={changes.lateSubmissionPenalty !== undefined ? changes.lateSubmissionPenalty : settings.lateSubmissionPenalty}
                                onChange={handleChange}
                                min="0"
                                max="100"
                            />
                        </div>
                    </section>

                    {/* Notifications */}
                    <section className="admin-settings__section">
                        <h2 className="admin-settings__section-title">Powiadomienia</h2>
                        
                        <div className="admin-settings__form-group admin-settings__form-group--checkbox">
                            <label className="admin-settings__checkbox-label">
                                <input 
                                    type="checkbox"
                                    name="emailNotifications"
                                    className="admin-settings__checkbox"
                                    checked={changes.emailNotifications !== undefined ? changes.emailNotifications : settings.emailNotifications}
                                    onChange={handleChange}
                                />
                                <span>Powiadomienia e-mail dla nauczycieli</span>
                            </label>
                        </div>

                        <div className="admin-settings__form-group admin-settings__form-group--checkbox">
                            <label className="admin-settings__checkbox-label">
                                <input 
                                    type="checkbox"
                                    name="gradeNotifications"
                                    className="admin-settings__checkbox"
                                    checked={changes.gradeNotifications !== undefined ? changes.gradeNotifications : settings.gradeNotifications}
                                    onChange={handleChange}
                                />
                                <span>Powiadomienia o nowych ocenach dla studentów</span>
                            </label>
                        </div>

                        <div className="admin-settings__form-group admin-settings__form-group--checkbox">
                            <label className="admin-settings__checkbox-label">
                                <input 
                                    type="checkbox"
                                    name="attendanceTracking"
                                    className="admin-settings__checkbox"
                                    checked={changes.attendanceTracking !== undefined ? changes.attendanceTracking : settings.attendanceTracking}
                                    onChange={handleChange}
                                />
                                <span>Śledzenie frekwencji</span>
                            </label>
                        </div>
                    </section>

                    {/* Data Management */}
                    <section className="admin-settings__section">
                        <h2 className="admin-settings__section-title">Zarządzanie danymi</h2>
                        
                        <div className="admin-settings__form-group admin-settings__form-group--checkbox">
                            <label className="admin-settings__checkbox-label">
                                <input 
                                    type="checkbox"
                                    name="enableAutoArchive"
                                    className="admin-settings__checkbox"
                                    checked={changes.enableAutoArchive !== undefined ? changes.enableAutoArchive : settings.enableAutoArchive}
                                    onChange={handleChange}
                                />
                                <span>Automatyczne archiwizowanie starych danych</span>
                            </label>
                        </div>

                        <div className="admin-settings__form-group">
                            <label className="admin-settings__label">Archiwizuj dane po (dni)</label>
                            <input 
                                type="number"
                                name="archiveAfterDays"
                                className="admin-settings__input"
                                value={changes.archiveAfterDays !== undefined ? changes.archiveAfterDays : settings.archiveAfterDays}
                                onChange={handleChange}
                                min="30"
                                max="1825"
                            />
                        </div>
                    </section>

                    {/* Actions */}
                    <div className="admin-settings__actions">
                        <button 
                            className="admin-settings__btn admin-settings__btn--cancel"
                            onClick={handleCancel}
                        >
                            Anuluj
                        </button>
                        <button 
                            className="admin-settings__btn admin-settings__btn--save"
                            onClick={handleSave}
                        >
                            Zapisz zmiany
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminSettingsPage;
