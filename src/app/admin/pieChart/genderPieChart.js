import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { useTranslation } from "react-i18next";

const COLORS = [
    '#0088FE', '#FF8042', '#FFBB28', '#00C49F', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
];

const GenderPieChart = ({ data }) => {
    const { t } = useTranslation("global");

    // Regroup data by gender
    const groupedData = data.reduce((acc, entry) => {
        const key = entry.gender.replace(/\s+/g, '');
        if (acc[key]) {
            acc[key]++;
        } else {
            acc[key] = 1;
        }
        return acc;
    }, {});

    // Create pie chart data
    const pieChartData = Object.keys(groupedData).map(gender => ({
        gender: t(`genderLabels.${gender}`, gender),
        numberOfUsers: groupedData[gender]
    }));

    // Calculate total users
    const totalUsers = pieChartData.reduce((total, entry) => total + entry.numberOfUsers, 0);

    // Assign colors dynamically
    const genderColorMap = pieChartData.reduce((acc, entry, index) => {
        acc[entry.gender] = COLORS[index % COLORS.length];
        return acc;
    }, {});

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div>
                <h4 style={{ textAlign: 'center' }}>{t("adminOptions.genderPieChartTitle")}</h4>
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
                                <Cell key={`cell-${index}`} fill={genderColorMap[entry.gender]} />
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
