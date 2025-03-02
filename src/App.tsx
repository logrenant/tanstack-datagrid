import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { Sidebar } from './components/Sidebar'
import { AuthProvider } from './contexts/AuthContext'
import { Login } from './pages/Login'
import { PostsPage } from './pages/PostPage'

import './App.css'
import './index.css'
import { TodoPage } from './pages/TodoPage'

export default function App() {


  return (
    <Router>
      <AuthProvider>
        <div className="">
          <Sidebar />
          <main className="bg-black">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/posts" element={<PostsPage />} />
              <Route path="/todos" element={<TodoPage />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  )
}