import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import { authAPI } from '../services/api';
import './Login.css'; // Create this

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await authAPI.login(formData);
            if (response.data.success) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Credenciales incorrectas');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-bg d-flex justify-content-center align-items-center min-vh-100">
            <Card className="login-card shadow-lg border-0 p-4">
                <Card.Body>
                    <div className="text-center mb-4">
                        <h2 className="fw-bold text-primary">Bienvenido</h2>
                        <p className="text-muted">Sistema de Gestión de Ventas</p>
                    </div>

                    {error && <Alert variant="danger" className="text-center py-2">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3 position-relative" controlId="formBasicEmail">
                            <FaUser className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                            <Form.Control
                                type="text"
                                name="username"
                                placeholder="Usuario / Email"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="ps-5 py-2 rounded-pill bg-light border-0"
                            />
                        </Form.Group>

                        <Form.Group className="mb-4 position-relative" controlId="formBasicPassword">
                            <FaLock className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Contraseña"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="ps-5 py-2 rounded-pill bg-light border-0"
                            />
                        </Form.Group>

                        <div className="d-grid">
                            <Button variant="primary" type="submit" className="rounded-pill py-2 fw-bold shadow-sm" disabled={loading}>
                                {loading ? 'Ingresando...' : 'INICIAR SESIÓN'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Login;
