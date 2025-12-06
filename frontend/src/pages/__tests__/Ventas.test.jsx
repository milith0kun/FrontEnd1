import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Ventas from '../Ventas';
import * as api from '../../services/api';

// Mock API
vi.mock('../../services/api', () => ({
    clientesAPI: {
        getAll: vi.fn(),
    },
    productosAPI: {
        getAll: vi.fn(),
    },
    ventasAPI: {
        create: vi.fn(),
    },
}));

// Mock SweetAlert2
vi.mock('sweetalert2', () => ({
    default: {
        fire: vi.fn(),
    },
}));

describe('Ventas Component', () => {
    beforeEach(() => {
        api.clientesAPI.getAll.mockResolvedValue({
            data: {
                data: [
                    { id: 1, nombre: 'Cliente Test' }
                ]
            }
        });
        api.productosAPI.getAll.mockResolvedValue({
            data: {
                data: [
                    { id: 100, nombre: 'Producto Test', precio: 50, stock: 10 }
                ]
            }
        });
    });

    it('renders sales interface', async () => {
        render(<Ventas />);

        await waitFor(() => {
            expect(screen.getByText('Nueva Venta')).toBeInTheDocument();
            const clientElements = screen.getAllByText('Cliente Test');
            expect(clientElements.length).toBeGreaterThan(0);
            const productElements = screen.getAllByText(/Producto Test/);
            expect(productElements.length).toBeGreaterThan(0);
        });
    });

    it('adds item to cart', async () => {
        render(<Ventas />);

        await waitFor(() => {
            const clientElements = screen.getAllByText('Cliente Test');
            expect(clientElements.length).toBeGreaterThan(0);
        });

        // Select Product
        const productSelect = screen.getByRole('combobox', { name: /Producto/i });
        fireEvent.change(productSelect, { target: { value: '100' } });

        // Click Add
        fireEvent.click(screen.getByRole('button', { name: /Agregar/i }));

        // Check Cart
        expect(screen.getByText('$50')).toBeInTheDocument();
        const productElements = screen.getAllByText(/Producto Test/);
        expect(productElements.length).toBeGreaterThan(0);
    });

    it('completes a sale', async () => {
        api.ventasAPI.create.mockResolvedValue({ data: { success: true } });
        render(<Ventas />);

        await waitFor(() => {
            const clientElements = screen.getAllByText('Cliente Test');
            expect(clientElements.length).toBeGreaterThan(0);
        });

        // Select Client
        const clientSelect = screen.getByRole('combobox', { name: /Cliente/i });
        fireEvent.change(clientSelect, { target: { value: '1' } });

        // Select Product & Add
        const productSelect = screen.getByRole('combobox', { name: /Producto/i });
        fireEvent.change(productSelect, { target: { value: '100' } });
        fireEvent.click(screen.getByRole('button', { name: /Agregar/i }));

        // Confirm Sale
        fireEvent.click(screen.getByRole('button', { name: /Confirmar Venta/i }));

        await waitFor(() => {
            expect(api.ventasAPI.create).toHaveBeenCalled();
        });
    });
});
