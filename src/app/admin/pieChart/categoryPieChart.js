import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { useTranslation } from "react-i18next";

const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
];

const CategoryPieChart = ({ data }) => {
    const { t } = useTranslation("global");

    // Regroup data by category
    const groupedData = data.reduce((acc, entry) => {
        const key = entry.categoryTitle.replace(/\s+/g, '');
        if (acc[key]) {
            acc[key] += entry.numberOfPosts;
        } else {
            acc[key] = entry.numberOfPosts;
        }
        return acc;
    }, {});

    // Create pie chart data
    const pieChartData = Object.keys(groupedData).map(categoryTitle => ({
        categoryTitle: t(`adminOptions.${categoryTitle}`, categoryTitle),
        numberOfPosts: groupedData[categoryTitle]
    }));

    // Calculate total posts
    const totalPosts = pieChartData.reduce((total, entry) => total + entry.numberOfPosts, 0);

    // Assign colors dynamically
    const categoryColorMap = pieChartData.reduce((acc, entry, index) => {
        acc[entry.categoryTitle] = COLORS[index % COLORS.length];
        return acc;
    }, {});

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div>
                <h4 style={{ textAlign: 'center' }}>{t("adminOptions.categoriePieChartTitle")}</h4>
                <PieChart width={400} height={400}>
                    <Pie
                        data={pieChartData}
                        cx={200}
                        cy={200}
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="numberOfPosts"
                        nameKey="categoryTitle"
                    >
                        {
                            pieChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={categoryColorMap[entry.categoryTitle]} />
                            ))
                        }
                    </Pie>
                    <Tooltip />
                    <Legend
                        layout="horizontal"
                        align="center"
                        verticalAlign="top"
                        formatter={(value, entry) => {
                            const percentage = (entry.payload.numberOfPosts / totalPosts * 100).toFixed(2);
                            return `${value} (${percentage}%)`;
                        }}
                    />
                </PieChart>
            </div>
        </div>
    );
};

export default CategoryPieChart;
