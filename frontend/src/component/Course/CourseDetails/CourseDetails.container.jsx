import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CourseDetails from './CourseDetails.component';
import './CourseDetails.scss';

// MOCK DATA
const MOCK_COURSE = {
    id: '1',
    name: 'Podstawy Programowania w JavaScript',
    description: 'Kompleksowy kurs wprowadzający do programowania w języku JavaScript, obejmujący podstawowe koncepcje, struktury danych oraz programowanie obiektowe.',
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2024-06-30T00:00:00Z',
    isPasswordProtected: true,
    owner: {
        id: 'owner1',
        firstName: 'Jan',
        lastName: 'Kowalski',
        email: 'jan.kowalski@example.com'
    }
};

const MOCK_PARTICIPANTS = [
    {
        id: 'user1',
        firstName: 'Anna',
        lastName: 'Nowak',
        email: 'anna.nowak@example.com',
        username: 'anowak',
        role: 'Student',
        enrollmentDate: '2024-01-20T10:30:00Z'
    },
    {
        id: 'user2',
        firstName: 'Piotr',
        lastName: 'Wiśniewski',
        email: 'piotr.wisniewski@example.com',
        username: 'pwisniewski',
        role: 'Student',
        enrollmentDate: '2024-01-22T14:15:00Z'
    },
    {
        id: 'user3',
        firstName: 'Maria',
        lastName: 'Zielińska',
        email: 'maria.zielinska@example.com',
        username: 'mzielinska',
        role: 'Teacher',
        enrollmentDate: '2024-01-15T08:00:00Z'
    },
    {
        id: 'user4',
        firstName: 'Tomasz',
        lastName: 'Lewandowski',
        email: 'tomasz.lewandowski@example.com',
        username: 'tlewandowski',
        role: 'Student',
        enrollmentDate: '2024-01-25T16:45:00Z'
    }
];

const CourseDetailsContainer = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulate API call with delay
        const loadMockData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 500));

                setCourse(MOCK_COURSE);
                setParticipants(MOCK_PARTICIPANTS);
            } catch (err) {
                setError('Wystąpił błąd podczas ładowania danych');
                console.error('Error loading mock data:', err);
            } finally {
                setLoading(false);
            }
        };

        loadMockData();
    }, [id]);

    const handleRemoveParticipant = async (userId) => {
        if (!window.confirm('Czy na pewno chcesz usunąć tego uczestnika?')) {
            return;
        }

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 300));

            setParticipants(prev => prev.filter(p => p.id !== userId));
            console.log('Removed participant:', userId);
        } catch (error) {
            console.error('Error removing participant:', error);
            alert('Nie udało się usunąć uczestnika');
        }
    };

    const handleAddParticipant = async (userId) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 300));

            // Mock: Find user from search results and add to participants
            console.log('Added participant:', userId);

            // In real implementation, this would refetch participants
            // For now, just log
        } catch (error) {
            console.error('Error adding participant:', error);
            alert('Nie udało się dodać uczestnika');
        }
    };

    return (
        <CourseDetails
            course={course}
            participants={participants}
            loading={loading}
            error={error}
            onRemoveParticipant={handleRemoveParticipant}
            onAddParticipant={handleAddParticipant}
        />
    );
};

export default CourseDetailsContainer;