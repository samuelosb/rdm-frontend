import React, { useState, useEffect } from 'react';
import { Col } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { useTranslation } from "react-i18next";

const TopPostsChart = ({ data }) => {
    const [topPosts, setTopPosts] = useState([]);
    const { t } = useTranslation("global");
    useEffect(() => {
        // Ordenar los datos por número de comentarios (de mayor a menor)
        const sortedData = data.sort((a, b) => b.numberOfComments - a.numberOfComments);
        // Seleccionar los 10 primeros posts
        const top10 = sortedData.slice(0, 10);
        setTopPosts(top10);
    }, [data]);

    return (
        <Col>
            <h4 style={{ textAlign: 'center' }}>{t("adminOptions.topPostChartTitle")}</h4>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={topPosts}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="postId" />
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

export default TopPostsChart;
