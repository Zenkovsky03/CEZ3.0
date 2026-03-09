import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../Layout/AdminLayout';
import { CoursesFilters, CoursesHeader, CoursesPagination, CoursesSidebar, CoursesTable } from '../components/ui';
import '../AdminCoursesPage.scss';

const initialCourses = [
    {
        id: '1',
        name: 'Podstawy Cloud Computing',
        description: 'Wstęp do rozwiązań chmurowych',
        instructor: 'Jan Kowalski',
        instructorInitials: 'JK',
        participants: 45,
        maxParticipants: 50,
        progress: 85,
        startDate: '2025-09-01',
        endDate: '2025-11-30',
        status: 'Aktywny'
    },
    {
        id: '2',
        name: 'Cyberbezpieczeństwo w firmie',
        description: 'Zasady ochrony danych',
        instructor: 'Anna Nowak',
        instructorInitials: 'AN',
        participants: 120,
        maxParticipants: 150,
        progress: 32,
        startDate: '2025-10-15',
        endDate: '2025-12-15',
        status: 'W trakcie'
    },
    {
        id: '3',
        name: 'Analiza Danych w Pythonie',
        description: 'Pandas, NumPy i Matplotlib',
        instructor: 'Marek Lewandowski',
        instructorInitials: 'ML',
        participants: 28,
        maxParticipants: 30,
        progress: 0,
        startDate: '2025-12-01',
        endDate: '2026-02-28',
        status: 'Planowany'
    },
    {
        id: '4',
        name: 'React Od Podstaw',
        description: 'Komponenty, hooki i routing',
        instructor: 'Karolina Wójcik',
        instructorInitials: 'KW',
        participants: 67,
        maxParticipants: 80,
        progress: 54,
        startDate: '2025-08-10',
        endDate: '2025-12-20',
        status: 'W trakcie'
    },
    {
        id: '5',
        name: 'Node.js API Masterclass',
        description: 'REST, auth i testy integracyjne',
        instructor: 'Piotr Zieliński',
        instructorInitials: 'PZ',
        participants: 39,
        maxParticipants: 40,
        progress: 91,
        startDate: '2025-07-01',
        endDate: '2025-10-31',
        status: 'Aktywny'
    },
    {
        id: '6',
        name: 'SQL i Modelowanie Danych',
        description: 'Relacje, indeksy i optymalizacja zapytań',
        instructor: 'Alicja Król',
        instructorInitials: 'AK',
        participants: 82,
        maxParticipants: 120,
        progress: 26,
        startDate: '2025-11-03',
        endDate: '2026-01-31',
        status: 'W trakcie'
    },
    {
        id: '7',
        name: 'Docker i Kubernetes',
        description: 'Konteneryzacja i orkiestracja aplikacji',
        instructor: 'Damian Nowicki',
        instructorInitials: 'DN',
        participants: 24,
        maxParticipants: 35,
        progress: 0,
        startDate: '2026-01-15',
        endDate: '2026-04-30',
        status: 'Planowany'
    },
    {
        id: '8',
        name: 'Podstawy UX/UI',
        description: 'Research, prototypowanie i testy użyteczności',
        instructor: 'Natalia Maj',
        instructorInitials: 'NM',
        participants: 56,
        maxParticipants: 60,
        progress: 72,
        startDate: '2025-06-10',
        endDate: '2025-09-15',
        status: 'Aktywny'
    },
    {
        id: '9',
        name: 'TypeScript Advanced',
        description: 'Typy generyczne i architektura frontendu',
        instructor: 'Michał Bąk',
        instructorInitials: 'MB',
        participants: 46,
        maxParticipants: 55,
        progress: 40,
        startDate: '2025-09-20',
        endDate: '2025-12-28',
        status: 'W trakcie'
    },
    {
        id: '10',
        name: 'C# i ASP.NET Core',
        description: 'Warstwy aplikacji, CQRS i autoryzacja',
        instructor: 'Rafał Gajda',
        instructorInitials: 'RG',
        participants: 98,
        maxParticipants: 110,
        progress: 65,
        startDate: '2025-08-25',
        endDate: '2025-12-05',
        status: 'Aktywny'
    },
    {
        id: '11',
        name: 'AI w Produkcie',
        description: 'Praktyczne wdrożenia modeli ML',
        instructor: 'Olga Szymańska',
        instructorInitials: 'OS',
        participants: 18,
        maxParticipants: 30,
        progress: 0,
        startDate: '2026-02-01',
        endDate: '2026-05-20',
        status: 'Planowany'
    },
    {
        id: '12',
        name: 'Testowanie Oprogramowania',
        description: 'Unit, integration i e2e testing',
        instructor: 'Joanna Kaczmarek',
        instructorInitials: 'JK',
        participants: 75,
        maxParticipants: 90,
        progress: 58,
        startDate: '2025-09-05',
        endDate: '2025-12-18',
        status: 'W trakcie'
    }
];

function AdminCoursesPage() {
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 9;

    const filteredCourses = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return initialCourses;

        return initialCourses.filter((course) =>
            [course.name, course.description, course.instructor].some((field) =>
                field.toLowerCase().includes(q)
            )
        );
    }, [query]);

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

    if (!token) {
        return null;
    }

    return (
        <AdminLayout onLogout={handleLogout}>
            <div className="admin-courses__container">
                <CoursesHeader />

                <div className="admin-courses__grid">
                    <section className="admin-courses__main">
                        <CoursesFilters
                            query={query}
                            onQueryChange={setQuery}
                            onClearFilters={handleClearFilters}
                        />

                        <CoursesTable courses={visibleCourses} />

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
