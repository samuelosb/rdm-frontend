/**
 * @module UserListPage
 *
 * This module defines the UserListPage component, which fetches and displays a list of users from the server.
 * It uses fetch for HTTP requests.
 * The component handles loading and error states, displaying appropriate messages when necessary.
 */

'use client';
import React, {useState, useEffect} from 'react';
import {Card, Container, Row, Col, Button, Spinner, Dropdown, DropdownButton} from 'react-bootstrap';
import {useTranslation} from 'react-i18next';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UserListPage() {
    const {t} = useTranslation("global");

    // State variables for user data, loading status, error handling, and toasts
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect hook to fetch user data when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Retrieve the access token from cookies
                const token = document.cookie.split('; ').find(row => row.startsWith('accessToken=')).split('=')[1];

                const requestOptions = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                };

                // Make a GET request to the server to fetch user data
                const response = await fetch(`${process.env.NEXT_PUBLIC_USERS_URL}/getAll`, requestOptions);

                if (response.ok) {
                    const data = await response.json();
                    // Update the state with the fetched user data
                    setUserData(data);
                } else {
                    throw new Error('Failed to fetch user data');
                }

                setLoading(false);
            } catch (error) {
                // Handle errors and update the error state
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Function to download all user data
    const downloadAllUserData = async (format) => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('accessToken=')).split('=')[1];

            const response = await fetch(`${process.env.NEXT_PUBLIC_USERS_URL}/exportAllUsers?format=${format}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `all_users_data.${format}`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
                toast.success(t("userListPage.downloadSuccess"));
            } else {
                const result = await response.json();
                setError(result.message || t("userListPage.errorDownloadingData"));
            }
        } catch (error) {
            console.error('Error downloading user data:', error);
            toast.error(t("userListPage.errorDownloadingData"));
        }
    };

    // Function to handle ban user
    const handleBanUser = async (userId) => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('accessToken=')).split('=')[1];

            const requestOptions = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({userId})
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_USERS_URL}/banUser`, requestOptions);

            if (response.ok) {
                // Update the user role to "Banned" in the state
                setUserData(userData.map(user =>
                    user._id === userId ? {...user, role: 'Banned'} : user
                ));
                toast.success(t("userListPage.banSuccess"));
            } else {
                throw new Error('Failed to ban user');
            }
        } catch (error) {
            console.error('Error banning user:', error);
            toast.error(t("userListPage.errorBanningUser"));
        }
    };

    // Function to handle unban user
    const handleUnbanUser = async (userId) => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('accessToken=')).split('=')[1];

            const requestOptions = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({userId})
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_USERS_URL}/unbanUser`, requestOptions);

            if (response.ok) {
                // Update the user role to "Basic" in the state
                setUserData(userData.map(user =>
                    user._id === userId ? {...user, role: 'Basic'} : user
                ));
                toast.success(t("userListPage.unbanSuccess"));
            } else {
                throw new Error('Failed to unban user');
            }
        } catch (error) {
            console.error('Error unbanning user:', error);
            toast.error(t("userListPage.errorUnbanningUser"));
        }
    };

    // Function to handle make admin
    const handleMakeAdmin = async (userId) => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('accessToken=')).split('=')[1];

            const requestOptions = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({userId, role: "Admin"})
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_USERS_URL}/makeAdmin`, requestOptions);

            if (response.ok) {
                // Update the user role to "Admin" in the state
                setUserData(userData.map(user =>
                    user._id === userId ? {...user, role: 'Admin'} : user
                ));
                toast.success(t("userListPage.makeAdminSuccess"));
            } else {
                throw new Error('Failed to make user admin');
            }
        } catch (error) {
            console.error('Error making user admin:', error);
            toast.error(t("userListPage.errorMakingAdmin"));
        }
    };

    // Function to handle withdraw admin
    const handleWithdrawAdmin = async (userId) => {
        try {
            const token = document.cookie.split('; ').find(row => row.startsWith('accessToken=')).split('=')[1];

            const requestOptions = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({userId, role: "Basic"})
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_USERS_URL}/withdrawAdmin`, requestOptions);

            if (response.ok) {
                // Update the user role to "Basic" in the state
                setUserData(userData.map(user =>
                    user._id === userId ? {...user, role: 'Basic'} : user
                ));
                toast.success(t("userListPage.withdrawAdminSuccess"));
            } else {
                throw new Error('Failed to withdraw admin rights');
            }
        } catch (error) {
            console.error('Error withdrawing admin rights:', error);
            toast.error(t("userListPage.errorWithdrawingAdmin"));
        }
    };

    // Render loading message if data is still being fetched
    if (loading) return (
        <Container className="d-flex justify-content-center align-items-center" style={{minHeight: '100vh'}}>
            <Spinner animation="border" role="status">
                <span className="visually-hidden">{t("userListPage.loading")}</span>
            </Spinner>
        </Container>
    );

    // Render error message if an error occurred during data fetching
    if (error) return <p>{t("userListPage.errorLoadingData")}: {error.message}</p>;

    // Render the list of users
    return (
        <Container>
            <ToastContainer/>
            <h1 className='text-center mt-4 mb-4'>{t("userListPage.title")}</h1>
            <Row className="mb-3 justify-content-center">
                <Col xs={12} md={10} lg={8} className="text-center">
                    <DropdownButton id="dropdown-basic-button" variant="secondary"
                                    title={t("userListPage.downloadData")}>
                        <Dropdown.Item
                            onClick={() => downloadAllUserData('json')}>
                            <img src="../download.png" className="me-2" width="20"
                                 height="20"/>
                            {t("userListPage.download")} JSON</Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => downloadAllUserData('csv')}>
                            <img src="../download.png" className="me-2" width="20"
                                 height="20"/>
                            {t("userListPage.download")} CSV</Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => downloadAllUserData('pdf')}>
                            <img src="../download.png" className="me-2" width="20"
                                 height="20"/>
                            {t("userListPage.download")} PDF</Dropdown.Item>
                    </DropdownButton>
                </Col>
            </Row>
            {userData.map(user => (
                <Row key={user._id} className="mb-3 justify-content-center">
                    <Col xs={12} md={10} lg={8}>
                        <Card className="text-center">
                            <Card.Header>
                                {t("userListPage.userInfo", {userId: user._id})}
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    <strong>{t("userListPage.name")}:</strong> {user.username}<br/>
                                    <strong>{t("userListPage.gender")}:</strong> {user.gender}<br/>
                                    <strong>{t("userListPage.role")}:</strong> {user.role}<br/>
                                    <strong>{t("userListPage.registrationDate")}:</strong> {user.creationAccountDate}<br/>
                                    <strong>{t("userListPage.numberOfPosts")}:</strong> {user.numberOfPosts}<br/>
                                    <strong>{t("userListPage.numberOfComments")}:</strong> {user.numberOfComments}<br/>
                                </Card.Text>
                                <Row>
                                    <Col xs={12} sm={6} className="mb-2">
                                        {user.role === 'Banned' ? (
                                            <Button
                                                variant="success"
                                                size="sm"
                                                className="w-100"
                                                onClick={() => handleUnbanUser(user._id)}
                                            >
                                                {t("userListPage.unban")}
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                className="w-100"
                                                onClick={() => handleBanUser(user._id)}
                                            >
                                                {t("userListPage.ban")}
                                            </Button>
                                        )}
                                    </Col>
                                    <Col xs={12} sm={6} className="mb-2">
                                        {user.role === 'Admin' ? (
                                            <Button
                                                variant="warning"
                                                size="sm"
                                                className="w-100"
                                                onClick={() => handleWithdrawAdmin(user._id)}
                                            >
                                                {t("userListPage.withdrawAdmin")}
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                className="w-100"
                                                onClick={() => handleMakeAdmin(user._id)}
                                            >
                                                {t("userListPage.makeAdmin")}
                                            </Button>
                                        )}
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            ))}
        </Container>
    );
}
