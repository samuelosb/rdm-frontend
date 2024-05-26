import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

const GenderPieChart = ({ data }) => {
    // Regroupement des données par genre
    const groupedData = data.reduce((acc, entry) => {
        if (acc[entry.gender]) {
            acc[entry.gender]++;
        } else {
            acc[entry.gender] = 1;
        }
        return acc;
    }, {});

    // Création des données pour le piechart
    const pieChartData = Object.keys(groupedData).map(gender => ({
        gender,
        numberOfUsers: groupedData[gender]
    }));

    // Calcul du nombre total d'utilisateurs
    const totalUsers = pieChartData.reduce((total, entry) => total + entry.numberOfUsers, 0);

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div>
                <h4 style={{ textAlign: 'center' }}>Porcentaje de tipos de usuarios</h4>
                <PieChart width={400} height={400}>
                    <Pie
                        data={pieChartData}
                        cx={200}
                        cy={200}
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="numberOfUsers"
                        nameKey="gender"
                    >
                        {
                            pieChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                            ))
                        }
                    </Pie>
                    <Tooltip />
                    <Legend
                        layout="horizontal"
                        align="center"
                        verticalAlign="top"
                        formatter={(value, entry) => {
                            const percentage = (entry.payload.numberOfUsers / totalUsers * 100).toFixed(2);
                            return `${value} (${percentage}%)`;
                        }}
                    />
                </PieChart>
            </div>
        </div>
    );
};

export default GenderPieChart;
