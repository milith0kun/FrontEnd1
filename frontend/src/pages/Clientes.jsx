import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Card } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaUserTie } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { clientesAPI } from '../services/api';

function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentClient, setCurrentClient] = useState({ nombre: '', documento_identidad: '', direccion: '', telefono: '' });

    useEffect(() => {
        loadClientes();
    }, []);

    const loadClientes = async () => {
        try {
            const response = await clientesAPI.getAll();
            setClientes(response.data.data || []);
        } catch (err) {
            console.error('Error loading clients:', err);
        }
    };

    const handleSave = async () => {
        try {
            if (currentClient.id) {
                await clientesAPI.update(currentClient.id, currentClient);
                Swal.fire('Actualizado', 'Cliente actualizado correctamente', 'success');
            } else {
                await clientesAPI.create(currentClient);
                Swal.fire('Creado', 'Cliente registrado correctamente', 'success');
            }
            setShowModal(false);
            loadClientes();
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Error al guardar cliente', 'error');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Se eliminará el cliente permanentemente",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar'
        });

        if (result.isConfirmed) {
            try {
                await clientesAPI.delete(id);
                Swal.fire('Eliminado', 'Cliente eliminado', 'success');
                loadClientes();
            } catch (err) {
                Swal.fire('Error', 'No se pudo eliminar el cliente', 'error');
            }
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark">Clientes</h2>
                <Button variant="primary" className="rounded-pill shadow-sm px-4" onClick={() => { setCurrentClient({ nombre: '', documento_identidad: '', direccion: '', telefono: '' }); setShowModal(true); }}>
                    <FaPlus className="me-2" /> Registrar Cliente
                </Button>
            </div>

            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <Table hover responsive className="mb-0 align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4 py-3">ID</th>
                                <th className="py-3">Nombre</th>
                                <th className="py-3">Documento</th>
                                <th className="py-3">Contacto</th>
                                <th className="text-end pe-4 py-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.length > 0 ? clientes.map(c => (
                                <tr key={c.id}>
                                    <td className="ps-4 fw-bold">#{c.id}</td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <div className="bg-light rounded-circle p-2 me-2 text-primary"><FaUserTie /></div>
                                            {c.nombre}
                                        </div>
                                    </td>
                                    <td><span className="badge bg-secondary">{c.documento_identidad}</span></td>
                                    <td>
                                        <small className="d-block text-muted">{c.direccion}</small>
                                        <small className="fw-bold">{c.telefono}</small>
                                    </td>
                                    <td className="text-end pe-4">
                                        <Button variant="light" size="sm" className="me-2 text-primary" onClick={() => { setCurrentClient(c); setShowModal(true); }}>
                                            <FaEdit />
                                        </Button>
                                        <Button variant="light" size="sm" className="text-danger" onClick={() => handleDelete(c.id)}>
                                            <FaTrash />
                                        </Button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" className="text-center py-4 text-muted">No hay clientes registrados</td></tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold">{currentClient.id ? 'Editar' : 'Nuevo'} Cliente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre Completo</Form.Label>
                            <Form.Control type="text" value={currentClient.nombre} onChange={e => setCurrentClient({ ...currentClient, nombre: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Documento Identidad</Form.Label>
                            <Form.Control type="text" value={currentClient.documento_identidad} onChange={e => setCurrentClient({ ...currentClient, documento_identidad: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control type="text" value={currentClient.direccion} onChange={e => setCurrentClient({ ...currentClient, direccion: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control type="text" value={currentClient.telefono} onChange={e => setCurrentClient({ ...currentClient, telefono: e.target.value })} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="light" onClick={() => setShowModal(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={handleSave}>Guardar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Clientes;
