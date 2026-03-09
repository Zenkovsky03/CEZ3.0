import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CourseForm from './CourseForm.component';
import { createCourse, getCourseById, updateCourse } from '../../../services/courseService';
import './CourseForm.scss';

const CourseFormContainer = ({ isEditMode = false }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        archived: false,
        isPasswordProtected: false,
        password: ''
    });

    useEffect(() => {
        if (isEditMode && id) {
            fetchCourseData(id);
        }
    }, [isEditMode, id]);

    const fetchCourseData = async (courseId) => {
        try {
            setLoading(true);
            const data = await getCourseById(courseId);

            setFormData({
                name: data.name,
                description: data.description,
                startDate: data.startDate.split('T')[0],
                endDate: data.endDate.split('T')[0],
                archived: data.archived,
                isPasswordProtected: data.isPasswordProtected,
                password: ''
            });
        } catch (error) {
            console.error('Error fetching course:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            if (isEditMode) {
                const editPayload = {
                    Name: formData.name,
                    Description: formData.description,
                    StartDate: new Date(formData.startDate).toISOString(),
                    EndDate: new Date(formData.endDate).toISOString()
                };
                await updateCourse(id, editPayload);
            } else {
                const createPayload = {
                    Name: formData.name,
                    Description: formData.description,
                    StartDate: new Date(formData.startDate).toISOString(),
                    EndDate: new Date(formData.endDate).toISOString(),
                    IsPasswordProtected: formData.isPasswordProtected,
                    Password: formData.isPasswordProtected ? formData.password : null
                };
                await createCourse(createPayload);
            }

            navigate('/courses');
        } catch (error) {
            console.error('Error saving course:', error);
            alert(error?.payload?.title || error?.message || 'Nie udało się zapisać kursu');
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode) {
        return <div>Ładowanie...</div>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <CourseForm
                formData={formData}
                onChange={handleChange}
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
                isEditMode={isEditMode}
            />
        </form>
    );
};

export default CourseFormContainer;
