import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../Layout/AdminLayout';
import { getUsers, getAllUsers, deleteUser } from '../../../services/userService';
import { 
    UserStatsCards, 
    UsersTable, 
    UsersPagination, 
    DeleteUserModal, 
    ErrorAlert 
} from './components/ui';
import './AdminUsersPageNew.scss';

const AdminUsersPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(9);
    const [totalPages, setTotalPages] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [stats, setStats] = useState({
        totalActive: 0,
        totalAdmins: 0,
        totalTeachers: 0,
        totalStudents: 0
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const [usersData, allUsersData] = await Promise.allSettled([
                    getUsers(pageNumber, pageSize),
                    getAllUsers()
                ]);

                if (usersData.status === 'fulfilled') {
                    const data = usersData.value;
                    setUsers(data.items || []);
                    setTotalPages(data.totalPage || 0);
                    setTotalUsers(data.totalItemCount || 0);
                } else {
                    setError(usersData.reason?.message || t('admin.failed_load_users'));
                }

                if (allUsersData.status === 'fulfilled') {
                    const allUsers = allUsersData.value.items || [];
                    setStats({
                        totalActive: allUsers.filter(u => u.isActive && !u.isBlocked).length,
                        totalAdmins: allUsers.filter(u => u.role === 'Admin').length,
                        totalTeachers: allUsers.filter(u => u.role === 'Teacher').length,
                        totalStudents: allUsers.filter(u => u.role === 'Student').length
                    });
                }
            } catch {
                setError(t('admin.failed_load_data'));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [pageNumber, pageSize, t]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('auth_user');
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
        window.location.href = '/admin';
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
            await deleteUser(userToDelete.id);

            setShowDeleteModal(false);
            setUserToDelete(null);

            const [usersData, allUsersData] = await Promise.allSettled([
                getUsers(pageNumber, pageSize),
                getAllUsers()
            ]);

            if (usersData.status === 'fulfilled') {
                const data = usersData.value;
                setUsers(data.items || []);
                setTotalPages(data.totalPage || 0);
                setTotalUsers(data.totalItemCount || 0);

                if (data.items.length === 0 && pageNumber > 1) {
                    setPageNumber(prev => prev - 1);
                }
            }

            if (allUsersData.status === 'fulfilled') {
                const allUsers = allUsersData.value.items || [];
                setStats({
                    totalActive: allUsers.filter(u => u.isActive && !u.isBlocked).length,
                    totalAdmins: allUsers.filter(u => u.role === 'Admin').length,
                    totalTeachers: allUsers.filter(u => u.role === 'Teacher').length,
                    totalStudents: allUsers.filter(u => u.role === 'Student').length
                });
            }
        } catch (err) {
            setDeleteError(err.message || t('admin.failed_delete_user'));
        } finally {
            setDeleting(false);
        }
    };

    return (
        <AdminLayout onLogout={handleLogout}>
            {/* Page Header */}
            <div className="admin-users__header">
                <div>
                    <h1>{t('admin.users')}</h1>
                    <p>{t('admin.manage_users')}</p>
                </div>
                <button
                    onClick={() => navigate('/admin/users/edit/new')}
                    className="admin-users__btn admin-users__btn--primary"
                >
                    <span className="material-symbols-outlined">add_circle</span>
                    <span>{t('admin.add_user')}</span>
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

