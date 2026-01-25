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
                    <Route path="/admin" element={<AdminLoginPage/>}/>
                    <Route path="/admin/users" element={<AdminUsersPage/>}/>
                    <Route path="/admin/users/edit/:id" element={<EditUserPage/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;