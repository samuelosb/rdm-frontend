import React, { useState, useEffect } from 'react';
import { Col } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { useTranslation } from "react-i18next";



const TopUsuariosPorPublicaciones = ({ data }) => {
    const [topUsuarios, setTopUsuarios] = useState([]);
    const { t } = useTranslation("global");
    useEffect(() => {
        // Ordenar los datos por número de publicaciones (de mayor a menor)
        const datosOrdenados = data.sort((a, b) => b.numberOfPosts - a.numberOfPosts);
        // Seleccionar los 10 primeros usuarios
        const top10 = datosOrdenados.slice(0, 10);
        setTopUsuarios(top10);
    }, [data]);

    return (
        <Col>
            <h4 style={{ textAlign: 'center' }}>{t("adminOptions.topUserbyPostsChartTitle")}</h4>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={topUsuarios}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="userId" />
                    <YAxis />
                    <Tooltip />
                    <Legend formatter={(value) => value === 'numberOfPosts' ? t("adminOptions.numberOfPosts") : value} />
                    <Bar dataKey="numberOfPosts" fill="#8884d8">
                        <LabelList dataKey="numberOfPosts" position="top" />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Col>
    );
};

export default TopUsuariosPorPublicaciones;
