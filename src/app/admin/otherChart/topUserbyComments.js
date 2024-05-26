import React, { useState, useEffect } from 'react';
import { Col } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

const TopUsuariosPorComentarios = ({ data }) => {
    const [topUsuarios, setTopUsuarios] = useState([]);

    useEffect(() => {
        // Ordenar los datos por número de comentarios (de mayor a menor)
        const datosOrdenados = data.sort((a, b) => b.numberOfComments - a.numberOfComments);
        // Seleccionar los 10 primeros usuarios
        const top10 = datosOrdenados.slice(0, 10);
        setTopUsuarios(top10);
    }, [data]);

    return (
        <Col>
            <h4 style={{ textAlign: 'center' }}>Top 10 de usuarios (con userId) con más comentarios</h4>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={topUsuarios}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="userId" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="numberOfComments" fill="#8884d8">
                        <LabelList dataKey="numberOfComments" position="top" />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Col>
    );
};

export default TopUsuariosPorComentarios;
