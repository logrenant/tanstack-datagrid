import { JSX } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { Login } from './pages/Login';
import { TodoPage } from './pages/TodoPage';
import { PostsPage } from './pages/PostPage';
import { Sidebar } from './components/Sidebar';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import './App.css';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isCheckingAuth } = useAuth();
  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="app-container">
    <Sidebar />
    <main className="main-content">{children}</main>
  </div>
);

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/posts" element={<PostsPage />} />
                    <Route path="/todos" element={<TodoPage />} />
                    <Route path="/" element={<Navigate to="/posts" />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
