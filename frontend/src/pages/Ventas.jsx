import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Row, Col, Card } from 'react-bootstrap';
import { FaShoppingCart, FaPlus, FaTimes, FaCheckCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { clientesAPI, productosAPI, ventasAPI } from '../services/api';

function Ventas() {
    const [clientes, setClientes] = useState([]);
    const [productos, setProductos] = useState([]);
    const [selectedCliente, setSelectedCliente] = useState('');
    const [selectedProducto, setSelectedProducto] = useState('');
    const [cantidad, setCantidad] = useState(1);
    const [carrito, setCarrito] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [clientesRes, productosRes] = await Promise.all([
                clientesAPI.getAll(),
                productosAPI.getAll({ limit: 100 })
            ]);
            setClientes(clientesRes.data.data || []);
            setProductos(productosRes.data.data || []);
        } catch (err) {
            console.error('Error loading data:', err);
        }
    };

    const addToCart = () => {
        if (!selectedProducto) return;
        const prod = productos.find(p => p.id === parseInt(selectedProducto));
        if (!prod) return;

        if (prod.stock < cantidad) {
            Swal.fire('Stock insuficiente', `Solo quedan ${prod.stock} unidades`, 'warning');
            return;
        }

        const item = {
            producto_id: prod.id,
            nombre: prod.nombre,
            precio_unitario: prod.precio,
            cantidad: parseInt(cantidad),
            subtotal: prod.precio * cantidad
        };

        setCarrito([...carrito, item]);
        setCantidad(1);
        setSelectedProducto('');
    };

    const removeFromCart = (index) => {
        const newCart = [...carrito];
        newCart.splice(index, 1);
        setCarrito(newCart);
    };

    const handleVenta = async () => {
        if (!selectedCliente || carrito.length === 0) {
            Swal.fire('Atención', 'Seleccione cliente y agregue productos', 'warning');
            return;
        }

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const ventaData = {
                cliente_id: selectedCliente,
                usuario_id: user ? user.id : 1,
                items: carrito,
                total: carrito.reduce((acc, item) => acc + item.subtotal, 0)
            };

            await ventasAPI.create(ventaData);
            Swal.fire('Éxito', 'Venta registrada exitosamente', 'success');
            setCarrito([]);
            setSelectedCliente('');
            loadData();
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Error al registrar venta', 'error');
        }
    };

    const total = carrito.reduce((acc, item) => acc + item.subtotal, 0);

    return (
        <div>
            <h2 className="mb-4 fw-bold text-dark">Nueva Venta</h2>

            <Row>
                <Col md={8}>
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Header className="bg-white border-0 fw-bold py-3">Detalle de Venta</Card.Header>
                        <Card.Body>
                            <Row className="mb-3 g-3">
                                <Col md={4}>
                                    <Form.Group controlId="selectCliente">
                                        <Form.Label className="text-muted small">Cliente</Form.Label>
                                        <Form.Select value={selectedCliente} onChange={e => setSelectedCliente(e.target.value)} className="form-select-lg fs-6">
                                            <option value="">Seleccionar cliente...</option>
                                            {clientes.map(c => (
                                                <option key={c.id} value={c.id}>{c.nombre}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group controlId="selectProducto">
                                        <Form.Label className="text-muted small">Producto</Form.Label>
                                        <Form.Select value={selectedProducto} onChange={e => setSelectedProducto(e.target.value)} className="form-select-lg fs-6">
                                            <option value="">Seleccionar producto...</option>
                                            {productos.map(p => (
                                                <option key={p.id} value={p.id}>{p.nombre} - ${p.precio}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={2}>
                                    <Form.Group controlId="inputCantidad">
                                        <Form.Label className="text-muted small">Cantidad</Form.Label>
                                        <Form.Control type="number" min="1" value={cantidad} onChange={e => setCantidad(e.target.value)} className="form-control-lg fs-6" />
                                    </Form.Group>
                                </Col>
                                <Col md={2} className="d-flex align-items-end">
                                    <Button variant="success" className="w-100 btn-lg fs-6" onClick={addToCart}>
                                        <FaPlus /> Agregar
                                    </Button>
                                </Col>
                            </Row>

                            <div className="table-responsive">
                                <Table hover className="align-middle">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="py-3 ps-3">Producto</th>
                                            <th className="py-3">Cant.</th>
                                            <th className="py-3">Precio</th>
                                            <th className="py-3">Subtotal</th>
                                            <th className="py-3 text-end pe-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {carrito.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="ps-3 fw-bold">{item.nombre}</td>
                                                <td>{item.cantidad}</td>
                                                <td>${item.precio_unitario}</td>
                                                <td className="fw-bold text-primary">${item.subtotal}</td>
                                                <td className="text-end pe-3">
                                                    <Button variant="link" className="text-danger p-0" onClick={() => removeFromCart(idx)}>
                                                        <FaTimes />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        {carrito.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="text-center py-5 text-muted">
                                                    <FaShoppingCart size={40} className="mb-3 opacity-25" />
                                                    <p className="mb-0">El carrito está vacío</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="border-0 shadow-sm bg-primary text-white">
                        <Card.Body className="p-4">
                            <h5 className="mb-4 opacity-75">Resumen del Pedido</h5>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Subtotal</span>
                                <span>${(total / 1.18).toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3 pb-3 border-bottom border-white border-opacity-25">
                                <span>IGV (18%)</span>
                                <span>${(total - (total / 1.18)).toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-4">
                                <span className="fs-4">Total</span>
                                <span className="fs-2 fw-bold">${total.toFixed(2)}</span>
                            </div>
                            <Button variant="light" size="lg" className="w-100 text-primary fw-bold" onClick={handleVenta}>
                                <FaCheckCircle className="me-2" /> Confirmar Venta
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default Ventas;
