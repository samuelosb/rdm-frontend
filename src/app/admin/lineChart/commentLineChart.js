import React, { useState, useEffect } from 'react';
import { Col } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from "react-i18next";

const CommentLineChart = ({ data }) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [yearsList, setYearsList] = useState([]);
    const [totalComments, setTotalComments] = useState(0);
    const { t } = useTranslation("global");
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
            const commentsThisYear = data.reduce((total, entry) => {
                const commentDate = new Date(entry.timePublication);
                const year = commentDate.getFullYear();
                if (year === selectedYear) {
                    return total + 1;
                }
                return total;
            }, 0);
            setTotalComments(commentsThisYear);
        }
    }, [data, selectedYear]);

    const monthsData = Array.from({ length: 12 }, (_, index) => ({
        month: index + 1,
        Total: 0,
    }));

    if (Array.isArray(data)) {
        data.forEach(entry => {
            const commentDate = new Date(entry.timePublication);
            const year = commentDate.getFullYear();
            const month = commentDate.getMonth();

            if (year === selectedYear) {
                monthsData[month]['Total']++;
            }
        });
    }

    const handleYearChange = (event) => {
        setSelectedYear(parseInt(event.target.value));
    };

    const getMonthName = (month) => {
        const monthNames = [
            t('dateLabels.Ene'),
            t('dateLabels.Feb'),
            t('dateLabels.Mar'),
            t('dateLabels.Abr'),
            t('dateLabels.May'),
            t('dateLabels.Jun'),
            t('dateLabels.Jul'),
            t('dateLabels.Ago'),
            t('dateLabels.Sep'),
            t('dateLabels.Oct'),
            t('dateLabels.Nov'),
            t('dateLabels.Dic')
        ];
        return monthNames[month - 1]; // Months are zero-based
    };

    return (
        <Col>
            <h4 style={{ textAlign: 'center' }}>{t("adminOptions.commentLineChartTitle")}</h4>
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                {totalComments > 0 && <p>{t("adminOptions.commentLineChartSubtitle")} {selectedYear}: {totalComments}</p>}
            </div>
            <select value={selectedYear} onChange={handleYearChange}>
                <option value="">Seleccionar...</option>
                {yearsList.map(year => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </select>
            <ResponsiveContainer width="100%" height={300}>
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

export default CommentLineChart;
