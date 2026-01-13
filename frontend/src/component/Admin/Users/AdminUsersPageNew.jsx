import React, { useState, useEffect } from 'react';
import AdminLayout from '../Layout/AdminLayout';
import { 
    AdminLoginForm, 
    UserStatsCards, 
    UsersTable, 
    UsersPagination, 
    DeleteUserModal, 
    ErrorAlert 
} from './components/ui';
import './AdminUsersPageNew.scss';

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(9);
    const [totalPages, setTotalPages] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [stats, setStats] = useState({
        totalActive: 0,
        totalAdmins: 0,
        totalTeachers: 0,
        totalStudents: 0
    });
    const [loginData, setLoginData] = useState({ username: 'admin', password: 'Password123!' });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    useEffect(() => {
        if (!token) return;

        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(null);

                const url = `/api/user/users?PageNumber=${pageNumber}&PageSize=${pageSize}`;
                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();
                setUsers(data.items || []);
                setTotalPages(data.totalPage || 0);
                setTotalUsers(data.totalItemCount || 0);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchAllUsersForStats = async () => {
            try {
                const url = `/api/user/users?PageNumber=1&PageSize=1000`;
                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    return;
                }

                const data = await response.json();
                const allUsers = data.items || [];
                

                setStats({
                    totalActive: allUsers.filter(u => u.isActive && !u.isBlocked).length,
                    totalAdmins: allUsers.filter(u => u.role === 'Admin').length,
                    totalTeachers: allUsers.filter(u => u.role === 'Teacher').length,
                    totalStudents: allUsers.filter(u => u.role === 'Student').length
                });
            } catch (err) {
                console.error('Error fetching stats:', err);
            }
        };

        fetchUsers();
        fetchAllUsersForStats();
    }, [pageNumber, pageSize, token]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            setLoading(true);

            const response = await fetch('/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login: loginData.username,
                    password: loginData.password
                })
            });

            if (!response.ok) {
                throw new Error('Nieprawidłowe dane logowania');
            }

            const data = await response.json();
            
            if (data.token) {

                const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
                

                const userRole = tokenPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] 
                    || tokenPayload['role'] 
                    || tokenPayload['Role'];
                

                const isAdmin = Array.isArray(userRole) 
                    ? userRole.includes('Admin') 
                    : userRole === 'Admin';
                
                if (!isAdmin) {
                    throw new Error('Brak uprawnień administratora. Tylko administratorzy mogą uzyskać dostęp do tego panelu.');
                }

                setToken(data.token);
                localStorage.setItem('token', data.token);
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setToken('');
        localStorage.removeItem('token');
        setUsers([]);
        setStats({
            totalActive: 0,
            totalAdmins: 0,
            totalTeachers: 0,
            totalStudents: 0
        });
        setPageNumber(1);
        setTotalPages(0);
        setTotalUsers(0);
        setError(null);
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setUserToDelete(null);
        setDeleteError(null);
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete) return;

        setDeleting(true);
        setDeleteError(null);

        try {
            const response = await fetch(`/api/user/${userToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `HTTP ${response.status}`);
            }

            setShowDeleteModal(false);
            setUserToDelete(null);

            const url = `/api/user/users?PageNumber=${pageNumber}&PageSize=${pageSize}`;
            const refreshResponse = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (refreshResponse.ok) {
                const data = await refreshResponse.json();
                setUsers(data.items || []);
                setTotalPages(data.totalPage || 0);
                setTotalUsers(data.totalItemCount || 0);

                if (data.items.length === 0 && pageNumber > 1) {
                    setPageNumber(prev => prev - 1);
                }
            }

            const statsUrl = `/api/user/users?PageNumber=1&PageSize=1000`;
            const statsResponse = await fetch(statsUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (statsResponse.ok) {
                const statsData = await statsResponse.json();
                const allUsers = statsData.items || [];
                
                setStats({
                    totalActive: allUsers.filter(u => u.isActive && !u.isBlocked).length,
                    totalAdmins: allUsers.filter(u => u.role === 'Admin').length,
                    totalTeachers: allUsers.filter(u => u.role === 'Teacher').length,
                    totalStudents: allUsers.filter(u => u.role === 'Student').length
                });
            }
        } catch (err) {
            setDeleteError(err.message || 'Nie udało się usunąć użytkownika');
        } finally {
            setDeleting(false);
        }
    };

    if (!token) {
        return (
            <AdminLoginForm 
                loginData={loginData}
                onInputChange={setLoginData}
                loading={loading}
                error={error}
                onSubmit={handleLogin}
            />
        );
    }

    return (
        <AdminLayout onLogout={handleLogout}>
            {/* Page Header */}
            <div className="admin-users__header">
                <div>
                    <h1>Użytkownicy</h1>
                    <p>Zarządzaj wszystkimi użytkownikami platformy</p>
                </div>
                <button className="admin-users__btn admin-users__btn--primary">
                    <span className="material-symbols-outlined">add_circle</span>
                    <span>Dodaj użytkownika</span>
                </button>
            </div>

            {/* Stats Cards */}
            <UserStatsCards 
                totalUsers={totalUsers}
                stats={stats}
            />

            {/* Error Message */}
            <ErrorAlert error={error} onClose={() => setError(null)} />

            {/* Users Table */}
            <UsersTable 
                users={users}
                loading={loading}
                onDeleteClick={handleDeleteClick}
            />

            {/* Pagination */}
            {totalPages > 1 && (
                <UsersPagination 
                    currentPage={pageNumber}
                    totalPages={totalPages}
                    onPageChange={setPageNumber}
                    totalItems={totalUsers}
                    itemsPerPage={pageSize}
                />
            )}

            {/* Delete Confirmation Modal */}
            <DeleteUserModal 
                show={showDeleteModal}
                user={userToDelete}
                deleting={deleting}
                error={deleteError}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </AdminLayout>
    );
};

export default AdminUsersPage;

