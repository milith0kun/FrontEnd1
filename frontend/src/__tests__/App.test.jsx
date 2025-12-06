import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '../App';

// Mock Pages
vi.mock('../pages/Login', () => ({ default: () => <div>Login Page</div> }));
vi.mock('../pages/Dashboard', () => ({ default: () => <div>Dashboard Page</div> }));
vi.mock('../pages/Productos', () => ({ default: () => <div>Productos Page</div> }));
vi.mock('../pages/Clientes', () => ({ default: () => <div>Clientes Page</div> }));
vi.mock('../pages/Ventas', () => ({ default: () => <div>Ventas Page</div> }));

// Mock Layout
vi.mock('../layout/Layout', () => ({
    default: ({ children }) => <div data-testid="layout">{children}</div>
}));

// Mock BrowserRouter to just render children so we can use MemoryRouter in tests
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        BrowserRouter: ({ children }) => <div>{children}</div>,
    };
});

describe('App Routing', () => {
    it('renders login on default route', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('renders dashboard on /dashboard', () => {
        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
        expect(screen.getByTestId('layout')).toBeInTheDocument();
    });
});
