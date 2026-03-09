import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../Layout/AdminLayout';
import './AdminStatsPage.scss';

const AdminStatsPage = () => {
	const navigate = useNavigate();
	const [token, setToken] = useState(localStorage.getItem('token') || '');

	const handleLogout = () => {
		setToken('');
		localStorage.removeItem('token');
		navigate('/admin');
	};

	if (!token) {
		return null;
	}

	return (
		<AdminLayout onLogout={handleLogout}>
			<section className="admin-placeholder-page">
				<h1>Statystyki</h1>
				<p>Ta zakladka jest w trakcie realizacji.</p>
			</section>
		</AdminLayout>
	);
};

export default AdminStatsPage;
