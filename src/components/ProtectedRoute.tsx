import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { CircularProgress, Box } from '@mui/material'
import { JSX } from 'react'

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { user, isCheckingAuth } = useAuth()

    if (isCheckingAuth) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        )
    }

    if (!user) {
        return <Navigate to="/" replace />
    }

    return children
}