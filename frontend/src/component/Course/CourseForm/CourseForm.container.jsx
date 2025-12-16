import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CourseForm from './CourseForm.component';
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
            const response = await fetch( `/api/courses/${courseId}`);
            const data = await response.json();

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

            const payload = {
                name: formData.name,
                description: formData.description,
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
                archived: formData.archived,
                isPasswordProtected: formData.isPasswordProtected,
                password: formData.isPasswordProtected ? formData.password : null
            };

            const url = isEditMode ? `/api/courses/${id}` : '/api/courses';
            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                navigate('/courses');
            } else {
                const error = await response.json();
                console.error('Error saving course:', error);
            }
        } catch (error) {
            console.error('Error:', error);
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