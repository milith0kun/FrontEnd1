import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FaBox, FaUsers, FaShoppingCart, FaDollarSign } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
    const data = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
        datasets: [
            {
                label: 'Ventas Mensuales',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Resumen de Ventas' },
        },
    };

    const StatCard = ({ title, value, icon, color }) => (
        <Card className={`border-0 shadow-sm h-100 border-start border-4 border-${color}`}>
            <Card.Body className="d-flex align-items-center">
                <div className={`bg-${color} bg-opacity-10 p-3 rounded-circle me-3 text-${color}`}>
                    {icon}
                </div>
                <div>
                    <h6 className="text-muted mb-1">{title}</h6>
                    <h3 className="fw-bold mb-0">{value}</h3>
                </div>
            </Card.Body>
        </Card>
    );

    return (
        <div>
            <h2 className="mb-4 fw-bold text-dark">Dashboard</h2>

            <Row className="g-4 mb-4">
                <Col md={3}>
                    <StatCard title="Ventas Totales" value="$1,250" icon={<FaDollarSign size={24} />} color="success" />
                </Col>
                <Col md={3}>
                    <StatCard title="Pedidos" value="45" icon={<FaShoppingCart size={24} />} color="primary" />
                </Col>
                <Col md={3}>
                    <StatCard title="Clientes" value="128" icon={<FaUsers size={24} />} color="info" />
                </Col>
                <Col md={3}>
                    <StatCard title="Productos" value="32" icon={<FaBox size={24} />} color="warning" />
                </Col>
            </Row>

            <Row>
                <Col md={8}>
                    <Card className="border-0 shadow-sm p-3">
                        <Bar options={options} data={data} />
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Header className="bg-white border-0 fw-bold">Actividad Reciente</Card.Header>
                        <Card.Body>
                            <ul className="list-unstyled">
                                <li className="mb-3 pb-3 border-bottom">
                                    <small className="text-muted d-block">Hace 5 min</small>
                                    <strong>Juan Pérez</strong> realizó una compra de $150
                                </li>
                                <li className="mb-3 pb-3 border-bottom">
                                    <small className="text-muted d-block">Hace 2 horas</small>
                                    Nuevo cliente registrado: <strong>María Garcia</strong>
                                </li>
                                <li>
                                    <small className="text-muted d-block">Hace 5 horas</small>
                                    Stock bajo en: <strong>Laptop HP</strong>
                                </li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default Dashboard;
