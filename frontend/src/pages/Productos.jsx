import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Card, InputGroup, Row, Col } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { productosAPI } from '../services/api';

function Productos() {
    const [productos, setProductos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({ nombre: '', precio: '', stock: '' });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadProductos();
    }, []);

    const loadProductos = async () => {
        try {
            const response = await productosAPI.getAll({ search: searchTerm });
            setProductos(response.data.data || []);
        } catch (err) {
            console.error('Error loading products:', err);
        }
    };

    const handleSave = async () => {
        try {
            if (currentProduct.id) {
                await productosAPI.update(currentProduct.id, currentProduct);
                Swal.fire('Actualizado', 'Producto actualizado correctamente', 'success');
            } else {
                await productosAPI.create(currentProduct);
                Swal.fire('Creado', 'Producto creado correctamente', 'success');
            }
            setShowModal(false);
            loadProductos();
        } catch (err) {
            Swal.fire('Error', 'No se pudo guardar el producto', 'error');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await productosAPI.delete(id);
                Swal.fire('Eliminado', 'El producto ha sido eliminado', 'success');
                loadProductos();
            } catch (err) {
                Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
            }
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark">Productos</h2>
                <Button variant="primary" className="rounded-pill shadow-sm px-4" onClick={() => { setCurrentProduct({ nombre: '', precio: '', stock: '' }); setShowModal(true); }}>
                    <FaPlus className="me-2" /> Nuevo Producto
                </Button>
            </div>

            <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                    <InputGroup className="mb-3">
                        <InputGroup.Text className="bg-white border-end-0"><FaSearch className="text-muted" /></InputGroup.Text>
                        <Form.Control
                            placeholder="Buscar productos..."
                            className="border-start-0 ps-0"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyUp={(e) => e.key === 'Enter' && loadProductos()}
                        />
                        <Button variant="outline-secondary" onClick={loadProductos}>Buscar</Button>
                    </InputGroup>
                </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <Table hover responsive className="mb-0 align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4 py-3">ID</th>
                                <th className="py-3">Nombre</th>
                                <th className="py-3">Precio</th>
                                <th className="py-3">Stock</th>
                                <th className="text-end pe-4 py-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.length > 0 ? productos.map(p => (
                                <tr key={p.id}>
                                    <td className="ps-4 fw-bold">#{p.id}</td>
                                    <td>{p.nombre}</td>
                                    <td className="text-success fw-bold">${p.precio}</td>
                                    <td>
                                        <span className={`badge bg-${p.stock < 10 ? 'danger' : 'success'} rounded-pill`}>
                                            {p.stock} u.
                                        </span>
                                    </td>
                                    <td className="text-end pe-4">
                                        <Button variant="light" size="sm" className="me-2 text-primary" onClick={() => { setCurrentProduct(p); setShowModal(true); }}>
                                            <FaEdit />
                                        </Button>
                                        <Button variant="light" size="sm" className="text-danger" onClick={() => handleDelete(p.id)}>
                                            <FaTrash />
                                        </Button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" className="text-center py-4 text-muted">No se encontraron productos</td></tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold">{currentProduct.id ? 'Editar' : 'Nuevo'} Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" value={currentProduct.nombre} onChange={e => setCurrentProduct({ ...currentProduct, nombre: e.target.value })} />
                        </Form.Group>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Precio</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>$</InputGroup.Text>
                                        <Form.Control type="number" value={currentProduct.precio} onChange={e => setCurrentProduct({ ...currentProduct, precio: e.target.value })} />
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Stock</Form.Label>
                                    <Form.Control type="number" value={currentProduct.stock} onChange={e => setCurrentProduct({ ...currentProduct, stock: e.target.value })} />
                                </Form.Group>
                            </Col>
                        </Row>
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

export default Productos;
