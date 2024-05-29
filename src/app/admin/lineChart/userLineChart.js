import React, { useState, useEffect } from 'react';
import { Col } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from "react-i18next";

const UserLineChart = ({ data }) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [yearsList, setYearsList] = useState([]);
    const [totalRegistrations, setTotalRegistrations] = useState(0);
    const [genders, setGenders] = useState([]);
    const { t } = useTranslation("global");

    useEffect(() => {
        // Extract all distinct years from the data
        const years = [...new Set(data.map(entry => new Date(entry.creationAccountDate).getFullYear()))];
        // Sort years in ascending order
        years.sort((a, b) => a - b);
        setYearsList(years);

        // Extract all distinct genders from the data
        const genders = [...new Set(data.map(entry => entry.gender))];
        setGenders(genders);
    }, [data]);

    useEffect(() => {
        // Calculate the total number of registrations for the selected year
        const registrationsThisYear = data.reduce((total, entry) => {
            const creationAccountDate = new Date(entry.creationAccountDate);
            const year = creationAccountDate.getFullYear();
            if (year === selectedYear) {
                return total + 1;
            }
            return total;
        }, 0);
        setTotalRegistrations(registrationsThisYear);
    }, [data, selectedYear]);

    // Create an array of data with an object for each month of the year and each gender
    const monthsData = Array.from({ length: 12 }, (_, index) => {
        const monthObject = { month: index + 1 };
        genders.forEach(gender => {
            monthObject[gender] = 0; // Initialize to 0, will be replaced by actual registrations
        });
        monthObject['Total'] = 0; // Initialize to 0, for the total registrations
        return monthObject;
    });

    // Count the number of registrations for each month and each gender
    data.forEach(entry => {
        const creationAccountDate = new Date(entry.creationAccountDate);
        const year = creationAccountDate.getFullYear(); // Get the year of registration
        const month = creationAccountDate.getMonth(); // Get the month of registration

        // Check if the registration is from the selected year
        if (year === selectedYear) {
            monthsData[month]['Total']++; // Increment the total number of registrations for this month
            monthsData[month][entry.gender]++; // Increment the number of registrations for this month and this gender
        }
    });

    // Handler function for year selector change
    const handleYearChange = (event) => {
        setSelectedYear(parseInt(event.target.value)); // Update the selected year
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
            <h4 style={{ textAlign: 'center' }}>{t("adminOptions.userLineChartTitle")}</h4>
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                {totalRegistrations > 0 &&
                    <p>{t("adminOptions.userLineChartSubtitle")} {selectedYear}: {totalRegistrations}</p>
                }
            </div>
            <select value={selectedYear} onChange={handleYearChange}>
                <option value="">{t("adminOptions.selectYear")}</option>
                {yearsList.map(year => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </select>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    data={monthsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tickFormatter={month => getMonthName(month)} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {genders.map(gender => (
                        <Line key={gender} type="monotone" dataKey={gender} name={t(`genderLabels.${gender.replace(/\s+/g, '')}`, gender)} stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`} activeDot={{ r: 8 }} />
                    ))}
                    <Line type="monotone" dataKey="Total" name="Total" stroke="#8884d8" activeDot={{ r: 8 }} /> {/* Line for the total */}
                </LineChart>
            </ResponsiveContainer>
        </Col>
    );
};

export default UserLineChart;
