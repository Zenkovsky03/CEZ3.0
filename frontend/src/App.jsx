import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Home from './component/Home';
import RegistrationPage from './component/Registration';
import LoginPage from './component/Login';
import CourseCreate from './component/Course/CourseCreate';
import CourseDetails from "./component/Course/CourseDetails";
import AdminLoginPage from './component/Admin/AdminLoginPage';
import AdminUsersPage from './component/Admin/Users/AdminUsersPageNew';
import EditUserPage from './component/Admin/Users/pages/EditUserPage';
import AdminCoursesPage from './component/Admin/Courses/pages/AdminCoursesPage';
import AdminDashboardPage from './component/Admin/Dashboard/AdminDashboardPage';
import AdminQuizzesPageNew from './component/Admin/Quizzes/AdminQuizzesPageNew';
import EditQuizPage from './component/Admin/Quizzes/pages/EditQuizPage';
import StudentGradesDetailsPage from './component/Admin/Quizzes/pages/StudentGradesDetailsPage';
import AdminNotificationsPageNew from './component/Admin/Notifications/AdminNotificationsPageNew';
import AdminContentPage from './component/Admin/Content/pages/AdminContentPage';
import AdminStatsPage from './component/Admin/Stats/pages/AdminStatsPage';
import CourseList from "./component/Course/CourseList";
import CourseStructure from "./component/Course/CourseStructure";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/register" element={<RegistrationPage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/courses" element={<CourseList/>}/>
                    <Route path="/courses/create" element={<CourseCreate/>}/>
                    <Route path="/courses/:id/edit" element={<CourseCreate isEditMode={true}/>}/>
                    <Route path="/courses/:id" element={<CourseDetails/>}/>
                    <Route path="/courses/:id/structure" element={<CourseStructure />} />
                    <Route path="/admin" element={<AdminLoginPage/>}/>
                    <Route path="/admin/dashboard" element={<AdminDashboardPage/>}/>
                    <Route path="/admin/users" element={<AdminUsersPage/>}/>
                    <Route path="/admin/users/edit/:id" element={<EditUserPage/>}/>
                    <Route path="/admin/courses" element={<AdminCoursesPage/>}/>
                    <Route path="/admin/quizzes" element={<AdminQuizzesPageNew/>}/>
                    <Route path="/admin/quizzes/students/:studentId" element={<StudentGradesDetailsPage/>}/>
                    <Route path="/admin/quizzes/:quizId" element={<EditQuizPage/>}/>
                    <Route path="/admin/notifications" element={<AdminNotificationsPageNew/>}/>
                    <Route path="/admin/content" element={<AdminContentPage/>}/>
                    <Route path="/admin/stats" element={<AdminStatsPage/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;