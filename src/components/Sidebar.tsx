import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'


export const Sidebar = () => {
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const { user, logout } = useAuth()

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
            logout()
            navigate('/login')
        } catch (error) {
            console.error('Logout error:', error)
            alert('Logout işlemi başarısız oldu')
        }
    }

    const menuItems = [
        { path: '/posts', label: 'Posts' },
        { path: '/todos', label: 'Todos' }
    ]

    return (
        <div className="w-64 h-screen bg-gray-50 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-800">Hoş geldin, {user}</h1>
            </div>

            <nav className="flex-1 p-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`block p-3 rounded-lg mb-1 ${pathname === item.path
                            ? 'bg-blue-100 text-blue-700'
                            : 'hover:bg-gray-200 text-gray-700'
                            }`}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="p-2 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className="w-full p-3 text-red-600 hover:bg-red-100 rounded-lg"
                >
                    Çıkış Yap
                </button>
            </div>
        </div>
    )
}