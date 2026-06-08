import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import CourseDetails from './CourseDetails.component';
import {
    addParticipantToCourse,
    getCourseById,
    getCourseParticipants,
    removeParticipantFromCourse
} from '../../../services/courseService';
import { getMyGrades } from '../../../services/gradeService';
import './CourseDetails.scss';

const CourseDetailsContainer = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);

            try {
                const [courseData, participantsData, gradesData] = await Promise.all([
                    getCourseById(id),
                    getCourseParticipants(id),
                    getMyGrades(id).catch(() => [])
                ]);

                setCourse(courseData || null);
                setParticipants(Array.isArray(participantsData) ? participantsData : []);
                const rawGrades = Array.isArray(gradesData) ? gradesData : gradesData?.items || gradesData?.Items || [];
                setGrades(rawGrades);
            } catch (err) {
                setError(t('error.load_course'));
                console.error('Error loading course details:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleRemoveParticipant = async (userId) => {
        if (!window.confirm(t('course.remove_participant_confirm'))) {
            return;
        }

        try {
            await removeParticipantFromCourse(id, userId);
            setParticipants(prev => prev.filter(p => p.id !== userId));
        } catch (error) {
            console.error('Error removing participant:', error);
            alert(t('error.remove_participant'));
        }
    };

    const handleAddParticipant = async (userId) => {
        try {
            await addParticipantToCourse(id, userId);
            const participantsData = await getCourseParticipants(id);
            setParticipants(Array.isArray(participantsData) ? participantsData : []);
        } catch (error) {
            console.error('Error adding participant:', error);
            alert(t('error.add_participant'));
        }
    };

    return (
        <CourseDetails
            course={course}
            participants={participants}
            grades={grades}
            loading={loading}
            error={error}
            onRemoveParticipant={handleRemoveParticipant}
            onAddParticipant={handleAddParticipant}
        />
    );
};

export default CourseDetailsContainer;
