import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../Layout/AdminLayout';
import { CoursesFilters, CoursesHeader, CoursesPagination, CoursesSidebar, CoursesTable } from '../components/ui';
import { deleteCourse, getCourses } from '../../../../services/adminApi';
import '../AdminCoursesPage.scss';

const getInitials = (firstName = '', lastName = '') => `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();

const getCourseStatus = (course) => {
    const now = new Date();
    const startDate = new Date(course.startDate);
    const endDate = new Date(course.endDate);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
        return 'Aktywny';
    }

    if (endDate < now) {
        return 'Archiwalny';
    }

    if (startDate > now) {
        return 'Planowany';
    }

    return 'W trakcie';
};

const getCourseProgress = (course) => {
    const startDate = new Date(course.startDate);
    const endDate = new Date(course.endDate);
    const now = new Date();

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || endDate <= startDate) {
        return 0;
    }

    const progress = ((now.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime())) * 100;
    return Math.max(0, Math.min(100, Math.round(progress)));
};

const normalizeCourse = (course) => {
    const instructor = [course.owner?.firstName, course.owner?.lastName].filter(Boolean).join(' ').trim() || 'Brak przypisanego prowadzącego';

    return {
        id: course.id,
        name: course.name,
        description: course.description,
        instructor,
        instructorInitials: getInitials(course.owner?.firstName, course.owner?.lastName) || '??',
        participants: course.participantsCount ?? 0,
        progress: getCourseProgress(course),
        startDate: course.startDate,
        endDate: course.endDate,
        status: getCourseStatus(course),
        ownerEmail: course.owner?.email || ''
    };
};

function AdminCoursesPage() {
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [importMessage, setImportMessage] = useState(null);
    const importInputRef = React.useRef(null);
    const rowsPerPage = 9;

    useEffect(() => {
        if (!token) {
            return;
        }

        const fetchCourses = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getCourses();
                setCourses((data || []).map(normalizeCourse));
            } catch (fetchError) {
                setError(fetchError.message || 'Nie udało się pobrać kursów');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [token]);

    const filteredCourses = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return courses;

        return courses.filter((course) =>
            [course.name, course.description, course.instructor, course.ownerEmail].some((field) =>
                field.toLowerCase().includes(q)
            )
        );
    }, [courses, query]);

    const totalPages = Math.max(1, Math.ceil(filteredCourses.length / rowsPerPage));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const startIndex = (safeCurrentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, filteredCourses.length);
    const visibleCourses = filteredCourses.slice(startIndex, endIndex);

    const handleLogout = () => {
        setToken('');
        localStorage.removeItem('token');
        navigate('/admin');
    };

    const handleClearFilters = () => {
        setQuery('');
        setCurrentPage(1);
    };

    const handleDeleteCourse = async (courseId) => {
        try {
            await deleteCourse(courseId);
            const data = await getCourses();
            setCourses((data || []).map(normalizeCourse));
        } catch (deleteError) {
            setError(deleteError.message || 'Nie udało się usunąć kursu');
        }
    };

    const handleEditCourse = (courseId) => {
        navigate(`/courses/${courseId}/edit`);
    };

    const handleAddCourse = () => {
        navigate('/courses/create');
    };

    const handleImportClick = () => {
        importInputRef.current?.click();
    };

    const handleImportChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        setImportMessage(`Wybrano plik ${file.name}. Import CSV nie jest jeszcze podłączony do backendu.`);
        event.target.value = '';
    };

    const handleExportCsv = () => {
        if (!filteredCourses.length) {
            setError('Brak kursów do eksportu.');
            return;
        }

        const headers = ['id', 'name', 'description', 'instructor', 'participants', 'startDate', 'endDate', 'status'];
        const csvRows = [
            headers.join(','),
            ...filteredCourses.map((course) => [
                course.id,
                course.name,
                course.description,
                course.instructor,
                course.participants,
                course.startDate,
                course.endDate,
                course.status
            ].map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(','))
        ];

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'courses-export.csv';
        anchor.click();
        URL.revokeObjectURL(url);
    };

    if (!token) {
        return null;
    }

    return (
        <AdminLayout onLogout={handleLogout}>
            <div className="admin-courses__container">
                <input ref={importInputRef} type="file" accept=".csv" onChange={handleImportChange} hidden />
                <CoursesHeader onImportClick={handleImportClick} onExportClick={handleExportCsv} onAddCourseClick={handleAddCourse} />

                {error && (
                    <div className="admin-users__error" style={{ marginBottom: '1rem' }}>
                        {error}
                    </div>
                )}

                {importMessage && (
                    <div className="admin-users__success" style={{ marginBottom: '1rem' }}>
                        {importMessage}
                    </div>
                )}

                <div className="admin-courses__grid">
                    <section className="admin-courses__main">
                        <CoursesFilters
                            query={query}
                            onQueryChange={setQuery}
                            onClearFilters={handleClearFilters}
                        />

                        <CoursesTable
                            courses={visibleCourses}
                            loading={loading}
                            onEditCourse={handleEditCourse}
                            onDeleteCourse={handleDeleteCourse}
                        />

                        <CoursesPagination
                            currentPage={safeCurrentPage}
                            totalPages={totalPages}
                            totalItems={filteredCourses.length}
                            itemsPerPage={rowsPerPage}
                            onPageChange={setCurrentPage}
                        />
                    </section>

                    <CoursesSidebar />
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminCoursesPage;
