import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

const CategoryPieChart = ({ data }) => {
    // Calcul du nombre total de publications
    const totalThreads = data.reduce((total, category) => total + category.NumberOfThreads, 0);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <h4 style={{ textAlign: 'center' }}>Porcentaje de categorías con los threads</h4>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <PieChart width={400} height={400}>
                    <Pie
                        data={data}
                        cx={200}
                        cy={200}
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="NumberOfThreads"
                        nameKey="categoryTitle"
                    >
                        {
                            data.map((entry, index) => (
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
                            const percentage = (entry.payload.NumberOfThreads / totalThreads * 100).toFixed(2);
                            return `${value} (${percentage}%)`;
                        }}
                    />
                </PieChart>
            </div>
        </div>
    );
};

export default CategoryPieChart;
