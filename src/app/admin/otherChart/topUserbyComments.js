import React, { useState, useEffect } from 'react';
import { Col } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { useTranslation } from "react-i18next";


const TopUsuariosPorComentarios = ({ data }) => {
    const [topUsuarios, setTopUsuarios] = useState([]);
    const { t } = useTranslation("global");
    useEffect(() => {
        // Ordenar los datos por número de comentarios (de mayor a menor)
        const datosOrdenados = data.sort((a, b) => b.numberOfComments - a.numberOfComments);
        // Seleccionar los 10 primeros usuarios
        const top10 = datosOrdenados.slice(0, 10);
        setTopUsuarios(top10);
    }, [data]);

    return (
        <Col>
            <h4 style={{ textAlign: 'center' }}>{t("adminOptions.topUserbyCommentsTitle")}</h4>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={topUsuarios}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="userId" />
                    <YAxis />
                    <Tooltip />
                    <Legend formatter={(value) => value === 'numberOfComments' ? t("adminOptions.numberOfComments") : value} />
                    <Bar dataKey="numberOfComments" fill="#8884d8">
                        <LabelList dataKey="numberOfComments" position="top" />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Col>
    );
};

export default TopUsuariosPorComentarios;
