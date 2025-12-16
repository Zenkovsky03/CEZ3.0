// CourseDetails/CourseDetails.container.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CourseDetails from './CourseDetails.component';
//import './CourseDetails.scss';

const CourseDetailsContainer = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            await Promise.all([
                fetchCourseDetails(),
                fetchParticipants()
            ]);
        } catch (err) {
            setError('Wystąpił błąd podczas ładowania danych');
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourseDetails = async () => {
        const response = await fetch(`${1}/courses/${id}`);
        if (!response.ok) throw new Error('Failed to fetch course');
        const data = await response.json();
        setCourse(data);
    };

    const fetchParticipants = async () => {
        const response = await fetch(`${1}/courses/${id}/participants`);
        if (!response.ok) throw new Error('Failed to fetch participants');
        const data = await response.json();
        setParticipants(data);
    };

    const handleRemoveParticipant = async (userId) => {
        if (!window.confirm('Czy na pewno chcesz usunąć tego uczestnika?')) {
            return;
        }

        try {
            const response = await fetch(
                `${1}/courses/${id}/participants/${userId}`,
                { method: 'DELETE' }
            );

            if (response.ok) {
                setParticipants(prev => prev.filter(p => p.id !== userId));
            } else {
                new Error('Failed to remove participant');
            }
        } catch (error) {
            console.error('Error removing participant:', error);
            alert('Nie udało się usunąć uczestnika');
        }
    };

    const handleAddParticipant = async (userId) => {
        try {
            const response = await fetch(
                `${1}/courses/${id}/participants`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId })
                }
            );

            if (response.ok) {
                await fetchParticipants();
            } else {
                new Error('Failed to add participant');
            }
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