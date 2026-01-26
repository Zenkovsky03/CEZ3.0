// CourseStructure/CourseStructure.container.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CourseStructure from './CourseStructure.component';
import './CourseStructure.scss';

// MOCK DATA
const MOCK_COURSE = {
    id: '1',
    name: 'Podstawy Programowania w JavaScript',
    description: 'Kompleksowy kurs wprowadzający do programowania w języku JavaScript.',
};

const MOCK_SECTIONS = [
    {
        id: '1',
        courseId: '1',
        title: 'Wprowadzenie do JavaScript',
        orderIndex: 1,
        isActive: true,
        createdAt: '2024-01-15T00:00:00Z',
        materials: [
            {
                id: 'm1',
                sectionId: '1',
                title: 'Co to jest JavaScript?',
                content: 'Wprowadzenie do języka JavaScript...',
                materialType: 'video',
                createdAt: '2024-01-15T00:00:00Z'
            },
            {
                id: 'm2',
                sectionId: '1',
                title: 'Pierwsze kroki z JavaScript',
                content: 'Podstawy składni...',
                materialType: 'text',
                createdAt: '2024-01-16T00:00:00Z'
            },
            {
                id: 'm3',
                sectionId: '1',
                title: 'Quiz - Wprowadzenie',
                content: 'Test wiedzy...',
                materialType: 'quiz',
                createdAt: '2024-01-17T00:00:00Z'
            }
        ],
        assignments: [
            {
                id: 'a1',
                sectionId: '1',
                title: 'Zadanie 1: Hello World',
                description: 'Napisz swój pierwszy program',
                maxPoint: 10,
                dueDate: '2024-02-01T23:59:00Z',
                taskType: 'coding',
                createdAt: '2024-01-15T00:00:00Z'
            }
        ]
    },
    {
        id: '2',
        courseId: '1',
        title: 'Zmienne i typy danych',
        orderIndex: 2,
        isActive: true,
        createdAt: '2024-01-20T00:00:00Z',
        materials: [
            {
                id: 'm4',
                sectionId: '2',
                title: 'Deklarowanie zmiennych',
                content: 'var, let, const...',
                materialType: 'video',
                createdAt: '2024-01-20T00:00:00Z'
            },
            {
                id: 'm5',
                sectionId: '2',
                title: 'Typy prymitywne',
                content: 'string, number, boolean...',
                materialType: 'text',
                createdAt: '2024-01-21T00:00:00Z'
            }
        ],
        assignments: []
    },
    {
        id: '3',
        courseId: '1',
        title: 'Funkcje w JavaScript',
        orderIndex: 3,
        isActive: true,
        createdAt: '2024-01-25T00:00:00Z',
        materials: [
            {
                id: 'm6',
                sectionId: '3',
                title: 'Deklarowanie funkcji',
                content: 'Function declaration vs expression...',
                materialType: 'video',
                createdAt: '2024-01-25T00:00:00Z'
            },
            {
                id: 'm7',
                sectionId: '3',
                title: 'Arrow functions',
                content: 'Nowoczesna składnia funkcji...',
                materialType: 'text',
                createdAt: '2024-01-26T00:00:00Z'
            },
            {
                id: 'm8',
                sectionId: '3',
                title: 'Parametry i argumenty',
                content: 'Przekazywanie wartości...',
                materialType: 'text',
                createdAt: '2024-01-27T00:00:00Z'
            }
        ],
        assignments: [
            {
                id: 'a2',
                sectionId: '3',
                title: 'Zadanie 2: Kalkulator',
                description: 'Stwórz prosty kalkulator używając funkcji',
                maxPoint: 20,
                dueDate: '2024-02-15T23:59:00Z',
                taskType: 'coding',
                createdAt: '2024-01-25T00:00:00Z'
            },
            {
                id: 'a3',
                sectionId: '3',
                title: 'Zadanie 3: Arrow functions',
                description: 'Przepisz funkcje na arrow functions',
                maxPoint: 15,
                dueDate: '2024-02-20T23:59:00Z',
                taskType: 'coding',
                createdAt: '2024-01-26T00:00:00Z'
            }
        ]
    },
    {
        id: '4',
        courseId: '1',
        title: 'Tablice i obiekty',
        orderIndex: 4,
        isActive: true,
        createdAt: '2024-02-01T00:00:00Z',
        materials: [],
        assignments: []
    }
];

const CourseStructureContainer = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadMockData = async () => {
            setLoading(true);
            setError(null);

            try {
                await new Promise(resolve => setTimeout(resolve, 600));
                setCourse(MOCK_COURSE);
                setSections(MOCK_SECTIONS);
            } catch (err) {
                setError('Wystąpił błąd podczas ładowania struktury kursu');
                console.error('Error loading course structure:', err);
            } finally {
                setLoading(false);
            }
        };

        loadMockData();
    }, [id]);

    const handleAddModule = () => {
        console.log('Add new module');
        // TODO: Navigate to add module form or open modal
    };

    const handleEditModule = (moduleId) => {
        console.log('Edit module:', moduleId);
        // TODO: Navigate to edit module form or open modal
    };

    const handleDeleteModule = async (moduleId) => {
        if (!window.confirm('Czy na pewno chcesz usunąć ten moduł?')) {
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            setSections(prev => prev.filter(s => s.id !== moduleId));
            console.log('Deleted module:', moduleId);
        } catch (error) {
            console.error('Error deleting module:', error);
            alert('Nie udało się usunąć modułu');
        }
    };

    return (
        <CourseStructure
            course={course}
            sections={sections}
            loading={loading}
            error={error}
            onAddModule={handleAddModule}
            onEditModule={handleEditModule}
            onDeleteModule={handleDeleteModule}
        />
    );
};

export default CourseStructureContainer;