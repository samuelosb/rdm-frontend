import React, { useState, useEffect } from 'react';
import { Col } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PostLineChart = ({ data }) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [yearsList, setYearsList] = useState([]);
    const [totalPosts, setTotalPosts] = useState(0);

    useEffect(() => {
        if (Array.isArray(data)) {
            const years = [...new Set(data.map(entry => new Date(entry.timePublication).getFullYear()))];
            years.sort((a, b) => a - b);
            setYearsList(years);
        } else {
            console.error('Expected data to be an array, but received:', data);
        }
    }, [data]);

    useEffect(() => {
        if (Array.isArray(data)) {
            const postsThisYear = data.reduce((total, entry) => {
                const timePublication = new Date(entry.timePublication);
                const year = timePublication.getFullYear();
                if (year === selectedYear) {
                    return total + 1;
                }
                return total;
            }, 0);
            setTotalPosts(postsThisYear);
        }
    }, [data, selectedYear]);

    const monthsData = Array.from({ length: 12 }, (_, index) => ({
        month: index + 1,
        Total: 0,
    }));

    if (Array.isArray(data)) {
        data.forEach(entry => {
            const timePublication = new Date(entry.timePublication);
            const year = timePublication.getFullYear();
            const month = timePublication.getMonth();

            if (year === selectedYear) {
                monthsData[month]['Total']++;
            }
        });
    }

    const handleYearChange = (event) => {
        setSelectedYear(parseInt(event.target.value));
    };

    return (
        <Col>
            <h4 style={{ textAlign: 'center' }}>Número de publicaciones por año</h4>
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                {totalPosts > 0 && <p>Número total de publicaciones en el año {selectedYear}: {totalPosts}</p>}
            </div>
            <select value={selectedYear} onChange={handleYearChange}>
                <option value="">Seleccionar...</option>
                {yearsList.map(year => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </select>
            <ResponsiveContainer width={800} height={300}>
                <LineChart data={monthsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tickFormatter={month => getMonthName(month)} />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="Total" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </Col>
    );
};

const getMonthName = (month) => {
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return monthNames[month - 1];
};

export default PostLineChart;
