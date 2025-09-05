import React, { useEffect, useState } from 'react';
import {
    Avatar,
    Button,
    TextField,
    Box,
    Typography,
    Container,
    Alert,
    CircularProgress,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import api from '../../contexts/AxiosContext';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
    const { isAuthenticated } = useAuth();

    const [email, setEmail] = useState('prashant@gmail.com');
    const [password, setPassword] = useState('pass@123');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated]);
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await api.post('/auth/login', { email, password });
            const { access_token, user } = res.data;

            localStorage.setItem('access_token', access_token);
            localStorage.setItem('user', JSON.stringify(user));

            
            sessionStorage.setItem('access_token', access_token);
            sessionStorage.setItem('user', JSON.stringify(user));


            navigate('/dashboard'); // redirect to dashboard after login
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>

                <Typography component="h1" variant="h5">
                    Login
                </Typography>

                <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoFocus
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <Alert severity="error">{error}</Alert>}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Sign In'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
