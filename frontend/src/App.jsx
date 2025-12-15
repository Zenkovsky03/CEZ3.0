import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import LandingPage from './component/Landing';
import RegistrationPage from './component/Registration';
import LoginPage from './component/Login';
import CourseCreate from './component/CourseCreate';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<LandingPage/>}/>
                    <Route path="/register" element={<RegistrationPage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/courses/create" element={<CourseCreate/>}/>
                    <Route path="/courses/:id/edit" element={<CourseCreate isEditMode={true}/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;