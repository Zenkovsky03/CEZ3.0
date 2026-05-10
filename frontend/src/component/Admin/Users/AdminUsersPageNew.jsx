import React, { useEffect, useMemo, useState, useContext } from 'react';
import AdminLayout from '../Layout/AdminLayout';
import { SearchContext } from '../../../context/SearchContext';
import { UsersTable, UsersPagination, DeleteUserModal, ErrorAlert } from './components/ui';
import CreateUserModal from './components/ui/CreateUserModal';
import { createUser, deleteUser, getUsersPage } from '../../../services/adminApi';
import './AdminUsersPageNew.scss';

const AdminUsersPage = () => {
    const { searchQuery, setSearchQuery } = useContext(SearchContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(9);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creatingUser, setCreatingUser] = useState(false);
    const [createUserError, setCreateUserError] = useState(null);
    const [createUserSuccess, setCreateUserSuccess] = useState(null);

    useEffect(() => {
        if (!token) return;

        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getUsersPage({ pageNumber: 1, pageSize: 1000 });
                setUsers(data.items || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [token]);

    const filteredUsers = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return users.filter((user) => {
            const matchesQuery = !query || [user.firstName, user.lastName, user.username, user.email].some((field) =>
                String(field || '').toLowerCase().includes(query)
            );
            const matchesRole = roleFilter === 'all' || user.role === roleFilter;
            const statusValue = user.isBlocked ? 'blocked' : user.isActive ? 'active' : 'inactive';
            const matchesStatus = statusFilter === 'all' || statusValue === statusFilter;

            return matchesQuery && matchesRole && matchesStatus;
        });
    }, [roleFilter, searchQuery, statusFilter, users]);

    const totalPagesFiltered = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
    const safePageNumber = Math.min(pageNumber, totalPagesFiltered);
    const pageUsers = filteredUsers.slice((safePageNumber - 1) * pageSize, safePageNumber * pageSize);

    const handleLogout = () => {
        setToken('');
        localStorage.removeItem('token');
        setUsers([]);
        setPageNumber(1);
        setError(null);
        window.location.href = '/admin';
    };

    const refreshUsers = async () => {
        const data = await getUsersPage({ pageNumber: 1, pageSize: 1000 });
        setUsers(data.items || []);
        setPageNumber(1);
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

            await refreshUsers();
        } catch (err) {
            setDeleteError(err.message || 'Nie udało się usunąć użytkownika');
        } finally {
            setDeleting(false);
        }
    };

    const handleCreateUser = async (payload) => {
        setCreatingUser(true);
        setCreateUserError(null);

        try {
            await createUser(payload);
            await refreshUsers();
            setShowCreateModal(false);
            setCreateUserSuccess('Użytkownik został utworzony.');
        } catch (err) {
            setCreateUserError(err.message || 'Nie udało się utworzyć użytkownika');
        } finally {
            setCreatingUser(false);
        }
    };

    if (!token) {
        return null;
    }

    return (
        <AdminLayout onLogout={handleLogout}>
            <div className="admin-users__header">
                <div>
                    <h1>Użytkownicy</h1>
                    <p>Zarządzaj wszystkimi użytkownikami platformy. Wyniki: {filteredUsers.length}</p>
                </div>
                <button className="admin-users__btn admin-users__btn--primary" onClick={() => setShowCreateModal(true)}>
                    <span className="material-symbols-outlined">add_circle</span>
                    <span>Dodaj użytkownika</span>
                </button>
            </div>

            <div className="admin-users__filters">
                <div className="admin-users__search-wrapper">
                    <span className="material-symbols-outlined" style={{ color: '#6b7280' }}>search</span>
                    <input
                        value={searchQuery}
                        onChange={(event) => {
                            setSearchQuery(event.target.value);
                            setPageNumber(1);
                        }}
                        placeholder="Szukaj po imieniu, nazwisku, loginie lub emailu"
                    />
                </div>

                <div className="admin-users__filters-actions">
                    <select
                        className="admin-users__filter-select"
                        value={roleFilter}
                        onChange={(event) => {
                            setRoleFilter(event.target.value);
                            setPageNumber(1);
                        }}
                    >
                        <option value="all">Wszystkie role</option>
                        <option value="Admin">Administratorzy</option>
                        <option value="Teacher">Nauczyciele</option>
                        <option value="Student">Studenci</option>
                    </select>

                    <select
                        className="admin-users__filter-select"
                        value={statusFilter}
                        onChange={(event) => {
                            setStatusFilter(event.target.value);
                            setPageNumber(1);
                        }}
                    >
                        <option value="all">Wszystkie statusy</option>
                        <option value="active">Aktywni</option>
                        <option value="inactive">Nieaktywni</option>
                        <option value="blocked">Zablokowani</option>
                    </select>

                    <button
                        type="button"
                        className="admin-users__clear-btn"
                        onClick={() => {
                            setSearchQuery('');
                            setRoleFilter('all');
                            setStatusFilter('all');
                            setPageNumber(1);
                        }}
                    >
                        Wyczyść filtry
                    </button>
                </div>
            </div>

            {createUserSuccess && (
                <div className="admin-users__success" style={{ marginBottom: '1rem' }}>
                    {createUserSuccess}
                </div>
            )}

            {/* Error Message */}
            <ErrorAlert error={error} onClose={() => setError(null)} />

            <UsersTable 
                users={pageUsers}
                loading={loading}
                onDeleteClick={handleDeleteClick}
            />

            {totalPagesFiltered > 1 && (
                <UsersPagination 
                    currentPage={safePageNumber}
                    totalPages={totalPagesFiltered}
                    onPageChange={setPageNumber}
                    totalItems={filteredUsers.length}
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

            <CreateUserModal
                show={showCreateModal}
                loading={creatingUser}
                error={createUserError}
                onSubmit={handleCreateUser}
                onCancel={() => {
                    setShowCreateModal(false);
                    setCreateUserError(null);
                }}
            />
        </AdminLayout>
    );
};

export default AdminUsersPage;

