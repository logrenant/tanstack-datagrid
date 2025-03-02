import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

type AuthContextType = {
    user: string | null
    login: (credentials: { email: string; password: string }) => void
    logout: () => void
    isCheckingAuth: boolean
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<string | null>(null)
    const [isCheckingAuth, setIsCheckingAuth] = useState(true)

    useEffect(() => {
        const checkAuth = () => {
            const storedUser = localStorage.getItem('user')
            setUser(storedUser)
            setIsCheckingAuth(false)
        }

        checkAuth()
        window.addEventListener('storage', checkAuth)

        return () => window.removeEventListener('storage', checkAuth)
    }, [])

    const login = ({ email }: { email: string; password: string }) => {
        setUser(email)
        localStorage.setItem('user', email)
    }

    console.log(user)

    const logout = () => {
        setUser(null)
        localStorage.removeItem('user')
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isCheckingAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)