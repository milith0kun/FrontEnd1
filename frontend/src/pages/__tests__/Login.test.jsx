import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Login from '../Login';
import * as api from '../../services/api';

// Mock API
vi.mock('../../services/api', () => ({
    authAPI: {
        login: vi.fn(),
    },
}));

const renderLogin = () => {
    render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>
    );
};

describe('Login Component', () => {
    it('renders login form', () => {
        renderLogin();
        expect(screen.getByPlaceholderText(/Usuario \/ Email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Contraseña/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /INICIAR SESIÓN/i })).toBeInTheDocument();
    });

    it('handles input changes', () => {
        renderLogin();
        const userInput = screen.getByPlaceholderText(/Usuario \/ Email/i);
        const passInput = screen.getByPlaceholderText(/Contraseña/i);

        fireEvent.change(userInput, { target: { value: 'testuser' } });
        fireEvent.change(passInput, { target: { value: 'password123' } });

        expect(userInput.value).toBe('testuser');
        expect(passInput.value).toBe('password123');
    });

    it('submits form and calls API', async () => {
        api.authAPI.login.mockResolvedValue({ data: { success: true, user: { id: 1, name: 'Test' } } });
        renderLogin();

        fireEvent.change(screen.getByPlaceholderText(/Usuario \/ Email/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /INICIAR SESIÓN/i }));

        await waitFor(() => {
            expect(api.authAPI.login).toHaveBeenCalledWith({ username: 'testuser', password: 'password123' });
        });
    });

    it('shows error on login failure', async () => {
        api.authAPI.login.mockRejectedValue({ response: { data: { message: 'Invalid credentials' } } });
        renderLogin();

        fireEvent.change(screen.getByPlaceholderText(/Usuario \/ Email/i), { target: { value: 'wrong' } });
        fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), { target: { value: 'wrong' } });
        fireEvent.click(screen.getByRole('button', { name: /INICIAR SESIÓN/i }));

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });
    });
});
