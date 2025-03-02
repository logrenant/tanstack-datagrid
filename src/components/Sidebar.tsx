import { Link, useLocation, useNavigate } from 'react-router-dom';

import './Sidebar.css';
import { useAuth } from '../contexts/AuthContext';

export const Sidebar = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            alert('Logout işlemi başarısız oldu');
        }
    };

    const menuItems = [
        { path: '/posts', label: 'Posts' },
        { path: '/todos', label: 'Todos' }
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h1>Hoş geldin, {user}</h1>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={pathname === item.path ? 'active' : ''}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};
