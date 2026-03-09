// CourseStructure/CourseStructure.container.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CourseStructure from './CourseStructure.component';
import AddModuleModal from './AddModuleModal.component';
import {
    createCourseSection,
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
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addModuleLoading, setAddModuleLoading] = useState(false);
    const [newModuleTitle, setNewModuleTitle] = useState('');
    const [newModuleOrderIndex, setNewModuleOrderIndex] = useState(1);

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
        setNewModuleTitle('');
        setNewModuleOrderIndex(sections.length + 1);
        setIsAddModalOpen(true);
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

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
        setNewModuleTitle('');
    };

    const handleCreateModule = async () => {
        try {
            setAddModuleLoading(true);
            await createCourseSection(id, {
                Title: newModuleTitle.trim(),
                OrderIndex: Number(newModuleOrderIndex) || 1
            });
            const sectionsData = await getCourseSections(id);
            setSections(Array.isArray(sectionsData) ? sectionsData : []);
            setIsAddModalOpen(false);
            setNewModuleTitle('');
        } catch (createError) {
            console.error('Error creating module:', createError);
            alert('Nie udało się utworzyć modułu');
        } finally {
            setAddModuleLoading(false);
        }
    };

    return (
        <>
            <CourseStructure
                course={course}
                sections={sections}
                loading={loading}
                error={error}
                onAddModule={handleAddModule}
                onEditModule={handleEditModule}
                onDeleteModule={handleDeleteModule}
            />
            <AddModuleModal
                isOpen={isAddModalOpen}
                onClose={handleCloseAddModal}
                onSubmit={handleCreateModule}
                title={newModuleTitle}
                orderIndex={newModuleOrderIndex}
                onTitleChange={setNewModuleTitle}
                onOrderIndexChange={setNewModuleOrderIndex}
                loading={addModuleLoading}
            />
        </>
    );
};

export default CourseStructureContainer;
