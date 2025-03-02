import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, TextField, Container, Box, Typography } from '@mui/material'
import { AuthContext } from '../contexts/AuthContext'

export const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        login({ email, password })
        navigate('/posts')
    }

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" gutterBottom>Login</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
                        Sign In
                    </Button>
                </form>
            </Box>
        </Container>
    )
}