'use client'
import React, {useState, useEffect} from 'react';
import {Card, Container, Row} from 'react-bootstrap';
import axios from 'axios';

/**
 * @module UserListPage
 *
 * This module defines the UserListPage component, which fetches and displays a list of users from the server.
 * It uses Axios for HTTP requests and React Bootstrap for styling and layout.
 * The component handles loading and error states, displaying appropriate messages when necessary.
 */

export default function UserListPage() {
    // State variables for user data, loading status, and error handling
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect hook to fetch user data when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Retrieve the access token from cookies
                const token = document.cookie.split('; ').find(row => row.startsWith('accessToken=')).split('=')[1];

                // Make a GET request to the server to fetch user data
                const response = await axios.get(process.env.NEXT_PUBLIC_USERS_URL + '/getAll', {
                    headers: {'Authorization': `Bearer ${token}`}
                });

                // Update the state with the fetched user data
                setUserData(response.data);
                setLoading(false);
            } catch (error) {
                // Handle errors and update the error state
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Render loading message if data is still being fetched
    if (loading) return <p>Loading...</p>;

    // Render error message if an error occurred during data fetching
    if (error) return <p>Error loading data: {error.message}</p>;

    // Render the list of users
    return (
        <Container>
            <h1 className='text-center mt-4 mb-4'>Lista de usuarios</h1>
            {userData.map(user => (
                <Row key={user._id} className={"mb-3"}>
                    <Card className="text-center">
                        <Card.Header>Información del usuario {user._id}</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <p><b>Nombre:</b> {user.username}</p>
                                <p><b>Género:</b> {user.gender}</p>
                                <p><b>Rol:</b> {user.role}</p>
                                <p><b>Fecha de registro:</b> {user.creationAccountDate}</p>
                                <p><b>Número de publicaciones:</b> {user.numberOfPosts}</p>
                                <p><b>Número de comentarios:</b> {user.numberOfComments}</p>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Row>
            ))}
        </Container>
    );
}
