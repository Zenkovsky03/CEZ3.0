import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseList from './CourseList.component';
import './CourseList.scss';

const MOCK_COURSES = [
    {
        id: '1',
        name: 'Podstawy Programowania w JavaScript',
        description: 'Kompleksowy kurs wprowadzający do programowania w języku JavaScript.',
        startDate: '2024-01-15T00:00:00Z',
        endDate: '2024-06-30T00:00:00Z',
        isPasswordProtected: true,
        participantsCount: 24,
        owner: {
            firstName: 'Jan',
            lastName: 'Kowalski'
        }
    },
    {
        id: '2',
        name: 'Zaawansowany React',
        description: 'Kurs dla programistów znających podstawy React, skupiający się na zaawansowanych wzorcach i optymalizacji.',
        startDate: '2024-02-01T00:00:00Z',
        endDate: '2024-07-31T00:00:00Z',
        isPasswordProtected: false,
        participantsCount: 18,
        owner: {
            firstName: 'Anna',
            lastName: 'Nowak'
        }
    },
    {
        id: '3',
        name: 'Node.js Backend Development',
        description: 'Tworzenie skalowalnych aplikacji backendowych z wykorzystaniem Node.js i Express.',
        startDate: '2024-03-10T00:00:00Z',
        endDate: '2024-08-31T00:00:00Z',
        isPasswordProtected: true,
        participantsCount: 15,
        owner: {
            firstName: 'Piotr',
            lastName: 'Wiśniewski'
        }
    },
    {
        id: '4',
        name: 'Bazy Danych SQL',
        description: 'Projektowanie i zarządzanie bazami danych SQL, optymalizacja zapytań.',
        startDate: '2024-01-20T00:00:00Z',
        endDate: '2024-05-30T00:00:00Z',
        isPasswordProtected: false,
        participantsCount: 32,
        owner: {
            firstName: 'Maria',
            lastName: 'Zielińska'
        }
    },
    {
        id: '5',
        name: 'Python dla Data Science',
        description: 'Analiza danych i machine learning z wykorzystaniem Python, pandas i scikit-learn.',
        startDate: '2024-02-15T00:00:00Z',
        endDate: '2024-09-15T00:00:00Z',
        isPasswordProtected: true,
        participantsCount: 28,
        owner: {
            firstName: 'Tomasz',
            lastName: 'Lewandowski'
        }
    },
    {
        id: '6',
        name: 'UI/UX Design Fundamentals',
        description: 'Podstawy projektowania interfejsów użytkownika i doświadczeń użytkownika.',
        startDate: '2024-03-01T00:00:00Z',
        endDate: '2024-07-01T00:00:00Z',
        isPasswordProtected: false,
        participantsCount: 21,
        owner: {
            firstName: 'Ewa',
            lastName: 'Kaczmarek'
        }
    }
];

const CourseListContainer = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        searchTerm: '',
        sortBy: 'name',
        filterByStatus: 'all' // all, active, upcoming, completed
    });

    useEffect(() => {
        const loadMockData = async () => {
            setLoading(true);
            setError(null);

            try {
                await new Promise(resolve => setTimeout(resolve, 800));
                setCourses(MOCK_COURSES);
            } catch (err) {
                setError('Wystąpił błąd podczas ładowania kursów');
                console.error('Error loading courses:', err);
            } finally {
                setLoading(false);
            }
        };

        loadMockData();
    }, []);

    const filteredCourses = useMemo(() => {
        let filtered = [...courses];

        // Search filter
        if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            filtered = filtered.filter(course =>
                course.name.toLowerCase().includes(searchLower) ||
                course.description.toLowerCase().includes(searchLower)
            );
        }

        // Status filter
        if (filters.filterByStatus !== 'all') {
            const now = new Date();
            filtered = filtered.filter(course => {
                const start = new Date(course.startDate);
                const end = new Date(course.endDate);

                if (filters.filterByStatus === 'active') {
                    return start <= now && now <= end;
                } else if (filters.filterByStatus === 'upcoming') {
                    return start > now;
                } else if (filters.filterByStatus === 'completed') {
                    return end < now;
                }
                return true;
            });
        }

        // Sort
        filtered.sort((a, b) => {
            switch (filters.sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'startDate':
                    return new Date(a.startDate) - new Date(b.startDate);
                case 'participants':
                    return b.participantsCount - a.participantsCount;
                default:
                    return 0;
            }
        });

        return filtered;
    }, [courses, filters]);

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const handleCreateCourse = () => {
        navigate('/courses/create');
    };

    return (
        <CourseList
            courses={filteredCourses}
            loading={loading}
            error={error}
            filters={filters}
            onFilterChange={handleFilterChange}
            onCreateCourse={handleCreateCourse}
        />
    );
};

export default CourseListContainer;