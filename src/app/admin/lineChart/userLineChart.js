import React, { useState, useEffect } from 'react';
import { Col } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const UserLineChart = ({ data }) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [yearsList, setYearsList] = useState([]);
    const [totalRegistrations, setTotalRegistrations] = useState(0);
    const [genders, setGenders] = useState([]);

    useEffect(() => {
        // Extraire toutes les années distinctes des données
        const years = [...new Set(data.map(entry => new Date(entry.creationAccountDate).getFullYear()))];
        // Tri des années par ordre croissant
        years.sort((a, b) => a - b);
        setYearsList(years);

        // Extraire tous les genres distincts des données
        const genders = [...new Set(data.map(entry => entry.gender))];
        setGenders(genders);
    }, [data]);

    useEffect(() => {
        // Calculer le nombre total d'inscriptions pour l'année sélectionnée
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

    // Créer un tableau de données avec un objet pour chaque mois de l'année et chaque genre
    const monthsData = Array.from({ length: 12 }, (_, index) => {
        const monthObject = { month: index + 1 };
        genders.forEach(gender => {
            monthObject[gender] = 0; // Initialiser à 0, sera remplacé par le nombre d'inscriptions réelles
        });
        monthObject['Total'] = 0; // Initialiser à 0, pour le total des inscriptions
        return monthObject;
    });

    // Compter le nombre d'inscriptions pour chaque mois et chaque genre
    data.forEach(entry => {
        const creationAccountDate = new Date(entry.creationAccountDate);
        const year = creationAccountDate.getFullYear(); // Obtenez l'année de l'inscription
        const month = creationAccountDate.getMonth(); // Obtenez le mois de l'inscription

        // Vérifiez si l'inscription est de l'année sélectionnée
        if (year === selectedYear) {
            monthsData[month]['Total']++; // Incrémentez le nombre total d'inscriptions pour ce mois
            monthsData[month][entry.gender]++; // Incrémentez le nombre d'inscriptions pour ce mois et ce genre
        }
    });

    // Fonction de gestionnaire de changement pour le sélecteur d'année
    const handleYearChange = (event) => {
        setSelectedYear(parseInt(event.target.value)); // Met à jour l'année sélectionnée
    };

    return (
        <Col>
            <h4 style={{ textAlign: 'center' }}>Número de registros por año</h4>
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                {totalRegistrations > 0 &&
                    <p>Número total de registros en el año {selectedYear}: {totalRegistrations}</p>
                }
            </div>
            <select value={selectedYear} onChange={handleYearChange}>
                <option value="">Seleccionar...</option>
                {yearsList.map(year => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </select>
            <ResponsiveContainer width={800} height={300}>
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
                        <Line key={gender} type="monotone" dataKey={gender} stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`} activeDot={{ r: 8 }} />
                    ))}
                    <Line type="monotone" dataKey="Total" stroke="#8884d8" activeDot={{ r: 8 }} /> {/* Courbe pour le total */}
                </LineChart>
            </ResponsiveContainer>
        </Col>
    );
};

// Fonction utilitaire pour obtenir le nom du mois à partir de son numéro
const getMonthName = (month) => {
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return monthNames[month - 1]; // Les mois commencent à 1
};

export default UserLineChart;
