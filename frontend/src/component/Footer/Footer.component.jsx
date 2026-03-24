import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
    <footer className="dashboard-footer">
        <div className="footer-links">
            <Link to="/terms">Regulamin</Link>
            <span>·</span>
            <Link to="/privacy">Polityka Prywatności</Link>
        </div>
    </footer>
);

export default Footer;