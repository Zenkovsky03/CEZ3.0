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
import CourseList from "./component/Course/CourseList";
import CourseStructure from "./component/Course/CourseStructure";
import CalendarPage from './component/Calendar';
import AssignmentsList from './component/Assignments/AssignmentsList';
import QuizSolve from './component/Assignments/QuizSolve';
import HomeworkSubmit from './component/Assignments/HomeworkSubmit';
import UngradedHomework from './component/Assignments/UngradedHomework';
import AssignmentCreate from './component/Assignments/AssignmentCreate';
import AssignmentResults from './component/Assignments/AssignmentResults';
import GradesPage from './component/Grades';
import TeacherGrades from './component/Grades/TeacherGrades';
import MessagesPage from './component/Messages/MessagesPage';
import ForumList from './component/Forum/ForumList';
import ForumThread from './component/Forum/ForumThread';
import LessonView from './component/Course/LessonView';
import ResetPassword from './component/ResetPassword/ResetPassword';
import CreateAnnouncement from './component/Announcements/CreateAnnouncement';
import AnnouncementDetails from './component/Announcements/AnnouncementDetails';
import EditAnnouncement from './component/Announcements/EditAnnouncement';
import CreateEvent from './component/Events/CreateEvent';
import EditEvent from './component/Events/EditEvent';
import ProtectedRoute from './component/ProtectedRoute/ProtectedRoute';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/register" element={<RegistrationPage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/reset-password" element={<ResetPassword/>}/>
                    <Route path="/courses" element={<CourseList/>}/>
                    <Route path="/courses/create" element={<CourseCreate/>}/>
                    <Route path="/courses/:id/edit" element={<CourseCreate isEditMode={true}/>}/>
                    <Route path="/courses/:id/structure" element={<CourseStructure />} />
                    <Route path="/courses/:cId/lessons/:lId" element={<LessonView/>}/>
                    <Route path="/courses/:id" element={<CourseDetails/>}/>
                    <Route path="/calendar" element={<CalendarPage/>}/>
                    <Route path="/events/create" element={<CreateEvent/>}/>
                    <Route path="/events/edit/:id" element={<EditEvent/>}/>
                    <Route path="/assignments" element={<AssignmentsList/>}/>
                    <Route path="/assignments/create" element={<AssignmentCreate/>}/>
                    <Route path="/assignments/ungraded" element={<UngradedHomework/>}/>
                    <Route path="/assignments/:id/results" element={<AssignmentResults/>}/>
                    <Route path="/assignments/:id/quiz" element={<QuizSolve/>}/>
                    <Route path="/assignments/:id/homework" element={<HomeworkSubmit/>}/>
                    <Route path="/grades" element={<GradesPage/>}/>
                    <Route path="/grades/course" element={<TeacherGrades/>}/>
                    <Route path="/messages" element={<MessagesPage/>}/>
                    <Route path="/forum" element={<ForumList/>}/>
                    <Route path="/forum/:id" element={<ForumThread/>}/>
                    <Route path="/announcements/create" element={<CreateAnnouncement/>}/>
                    <Route path="/announcements/:id" element={<AnnouncementDetails/>}/>
                    <Route path="/announcements/:id/edit" element={<EditAnnouncement/>}/>
                    <Route path="/admin" element={<AdminLoginPage/>}/>
                    <Route path="/admin/users" element={<ProtectedRoute roles={['Admin']}><AdminUsersPage/></ProtectedRoute>}/>
                    <Route path="/admin/users/edit/:id" element={<ProtectedRoute roles={['Admin']}><EditUserPage/></ProtectedRoute>}/>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;