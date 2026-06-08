// CourseStructure/CourseStructure.container.jsx
import React, { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import AuthContext from '../../../context/AuthContext';
import CourseStructure from './CourseStructure.component';
import AddModuleModal from './AddModuleModal.component';
import {
    createCourseSection,
    deleteCourseSection,
    getCourseById,
    getCourseSections
} from '../../../services/courseService';
import { getMaterialsBySection } from '../../../services/sectionMaterialService';
import { getAssignmentsByCourse } from '../../../services/assignmentService';
import './CourseStructure.scss';

const enrichSectionsWithItems = async (sections, courseId) => {
    if (!sections.length) return sections;

    const [materialsBySection, assignments] = await Promise.all([
        Promise.all(sections.map(s => getMaterialsBySection(s.id).catch(() => []))),
        getAssignmentsByCourse(courseId).catch(() => [])
    ]);

    const assignmentsBySectionId = {};
    if (Array.isArray(assignments)) {
        assignments.forEach(a => {
            const sid = typeof a.sectionId === 'string' ? a.sectionId : (a.sectionId?.toString?.() || '');
            if (!assignmentsBySectionId[sid]) assignmentsBySectionId[sid] = [];
            assignmentsBySectionId[sid].push({ ...a, itemType: 'assignment' });
        });
    }

    return sections.map((section, i) => ({
        ...section,
        materials: Array.isArray(materialsBySection[i]) ? materialsBySection[i] : [],
        assignments: assignmentsBySectionId[section.id] || []
    }));
};

const CourseStructureContainer = () => {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
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

                const rawSections = Array.isArray(sectionsData) ? sectionsData : [];
                setCourse(courseData || null);
                setSections(await enrichSectionsWithItems(rawSections, id));
            } catch (err) {
                setError(t('error.load_course_structure'));
                console.error('Error loading course structure:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleAddModule = () => {
        setNewModuleTitle('');
        setNewModuleOrderIndex(sections.length + 1);
        setIsAddModalOpen(true);
    };

    const handleEditModule = () => {
        // Edit module functionality not yet implemented
    };

    const handleDeleteModule = async (moduleId) => {
        if (!window.confirm(t('course.module_delete_confirm'))) {
            return;
        }

        try {
            await deleteCourseSection(moduleId);
            const remaining = sections.filter(s => s.id !== moduleId);
            setSections(await enrichSectionsWithItems(remaining, id));
        } catch (error) {
            console.error('Error deleting module:', error);
            alert(t('error.delete_module'));
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
            alert(t('error.create_module'));
        } finally {
            setAddModuleLoading(false);
        }
    };

    const handleRefresh = async () => {
        try {
            const [courseData, sectionsData] = await Promise.all([
                getCourseById(id),
                getCourseSections(id)
            ]);
            const rawSections = Array.isArray(sectionsData) ? sectionsData : [];
            setCourse(courseData || null);
            setSections(await enrichSectionsWithItems(rawSections, id));
        } catch (err) {
            console.error('Error refreshing course data:', err);
        }
    };

    const canModify = user?.role === 'Teacher';

    return (
        <>
            <CourseStructure
                course={course}
                sections={sections}
                loading={loading}
                error={error}
                onAddModule={canModify ? handleAddModule : undefined}
                onEditModule={canModify ? handleEditModule : undefined}
                onDeleteModule={canModify ? handleDeleteModule : undefined}
                onRefresh={canModify ? handleRefresh : undefined}
                canModify={canModify}
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
