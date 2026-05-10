import React from 'react';
import { Navigate } from 'react-router-dom';

function AdminDashboardPage() {
    return <Navigate to="/admin/stats" replace />;
}

export default AdminDashboardPage;
