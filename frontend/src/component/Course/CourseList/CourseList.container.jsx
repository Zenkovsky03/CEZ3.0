import React, { useContext, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../../context/AuthContext';
import CourseList from './CourseList.component';
import { getCourses } from '../../../services/courseService';
import './CourseList.scss';

const CourseListContainer = () => {
    const { user } = useContext(AuthContext);
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
        const loadCourses = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await getCourses();
                setCourses(Array.isArray(data) ? data : []);
            } catch (err) {
                setError('Wystąpił błąd podczas ładowania kursów');
                console.error('Error loading courses:', err);
            } finally {
                setLoading(false);
            }
        };

        loadCourses();
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
                    return (b.participantsCount ?? 0) - (a.participantsCount ?? 0);
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

    const canCreate = user?.role === 'Admin' || user?.role === 'Teacher';

    return (
        <CourseList
            courses={filteredCourses}
            loading={loading}
            error={error}
            filters={filters}
            onFilterChange={handleFilterChange}
            onCreateCourse={canCreate ? handleCreateCourse : undefined}
        />
    );
};

export default CourseListContainer;
