import React, { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import Dashboard from '../Dashboard';
import Landing from '../Landing';

const Home = () => {
    const { user } = useContext(AuthContext);

    return user ? <Dashboard /> : <Landing />;
};

export default Home;
