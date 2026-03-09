// CourseStructure/CourseStructure.container.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CourseStructure from './CourseStructure.component';
import {
    deleteCourseSection,
    getCourseById,
    getCourseSections
} from '../../../services/courseService';
import './CourseStructure.scss';

const CourseStructureContainer = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);

            try {
                const [courseData, sectionsData] = await Promise.all([
                    getCourseById(id),
                    getCourseSections(id)
                ]);

                setCourse(courseData || null);
                setSections(Array.isArray(sectionsData) ? sectionsData : []);
            } catch (err) {
                setError('Wystąpił błąd podczas ładowania struktury kursu');
                console.error('Error loading course structure:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
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
            await deleteCourseSection(moduleId);
            setSections(prev => prev.filter(s => s.id !== moduleId));
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
